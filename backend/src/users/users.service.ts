import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, Not } from "typeorm";
import { FindOrCreateUserDto, UpdateUserDto } from "./dto";
import { FilesService } from "src/files/files.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async findOrCreate(findOrCreateUserDto: FindOrCreateUserDto): Promise<User> {
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

    return result[0] as User;
  }

  findAll(offset: number = 0, limit: number = 10): Promise<User[]> {
    return this.userRepository.find({ skip: offset, take: limit });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
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
      .update(User)
      .set(data)
      .whereEntity(user)
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as User);
  }

  async updateAvatar(user: User, avatar: Express.Multer.File): Promise<User> {
    const oldAvatarUrl = user.avatarUrl;
    const newAvatar = await this.filesService.uploadFile(avatar);

    const updatedUser = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ avatarUrl: newAvatar.path })
      .whereEntity(user)
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as User);

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
