import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository, Not } from "typeorm";
import { FindOrCreateUserDto, UpdateUserDto } from "./dto";
import { FilesService } from "src/files/files.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
  ) {}

  async findOrCreate(findOrCreateUserDto: FindOrCreateUserDto): Promise<UserEntity> {
    const result = await this.userRepository.query(
      `
      WITH insert AS (
        INSERT INTO "user" ("username", "email", "intraId")
        VALUES ($1, $2, $3)
        ON CONFLICT ("intraId", "email") DO NOTHING
        RETURNING *
      )
      SELECT * FROM insert
      UNION ALL
      SELECT * FROM "user"
      WHERE "intraId" = $3
      LIMIT 1;
    `,
      [
        findOrCreateUserDto.username,
        findOrCreateUserDto.email,
        findOrCreateUserDto.intraId,
      ],
    );

    return result[0] as UserEntity;
  }

  findAll(offset: number = 0, limit: number = 10): Promise<UserEntity[]> {
    return this.userRepository.find({ skip: offset, take: limit });
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return user;
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const isUsernameTaken = await this.userRepository.exist({
      where: {
        id: Not(user.id),
        username: updateUserDto.username,
      },
    });

    if (isUsernameTaken) {
      throw new ConflictException(
        `Username already taken: ${updateUserDto.username}`,
      );
    }

    const data = {
      ...updateUserDto,
      registrationComplete: true,
    };

    return this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .whereEntity(user)
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as UserEntity);
  }

  async updateAvatar(user: UserEntity, avatar: Express.Multer.File): Promise<UserEntity> {
    const oldAvatarUrl = user.avatarUrl;
    const newAvatar = await this.filesService.uploadFile(avatar);

    const updatedUser = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ avatarUrl: newAvatar.path })
      .whereEntity(user)
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as UserEntity);

    if (!!oldAvatarUrl) {
      const oldAvatar = await this.filesService.findFile(oldAvatarUrl);

      if (!!oldAvatar) {
        await this.filesService.deleteFile(oldAvatar);
      }
    }

    return updatedUser;
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({
      username,
    });
  }
}
