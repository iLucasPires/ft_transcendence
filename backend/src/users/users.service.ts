import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository, Not } from "typeorm";
import { FindOrCreateUserDto, ListUsersDto, UpdateUserDto } from "./dto";
import { FilesService } from "src/files/files.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
  ) {}

  async findOrCreate(
    findOrCreateUserDto: FindOrCreateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      intraId: findOrCreateUserDto.intraId,
    });

    if (!!user) {
      return user;
    }

    return await this.userRepository.save(findOrCreateUserDto);
  }

  findMany(
    user: UserEntity,
    listUsersDto: ListUsersDto,
  ): Promise<UserEntity[]> {
    const { offset = 0, limit = 10 } = listUsersDto;

    return this.userRepository
      .createQueryBuilder("user")
      .where(
        `NOT EXISTS (
          SELECT 1 FROM blocked_users block
          WHERE
            (user.id = block.blocked_id AND block.blocker_id = :id)
          OR
            (user.id = block.blocker_id AND block.blocked_id = :id)
        )`,
        { id: user.id },
      )
      .skip(offset)
      .take(limit)
      .getMany();
  }

  findBlockedUsers(
    user: UserEntity,
    listUsersDto: ListUsersDto,
  ): Promise<UserEntity[]> {
    const { offset = 0, limit = 10 } = listUsersDto;

    return this.userRepository
      .createQueryBuilder("user")
      .innerJoin("user.blockedBy", "blockedBy")
      .where("blockedBy.id = :id", { id: user.id })
      .skip(offset)
      .take(limit)
      .getMany();
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

  async update(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
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

  async updateAvatar(
    user: UserEntity,
    avatar: Express.Multer.File,
  ): Promise<UserEntity> {
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

  async block(blocker: UserEntity, username: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    if (user.id === blocker.id) {
      throw new BadRequestException("You cannot block yourself");
    }

    const isAlreadyBlocked = await this.userRepository.exist({
      where: {
        id: blocker.id,
        blockedUsers: {
          id: user.id,
        },
      },
      relations: {
        blockedUsers: true,
      },
    });

    if (isAlreadyBlocked) {
      throw new ConflictException(`User already blocked: ${username}`);
    }

    await this.userRepository
      .createQueryBuilder()
      .relation(UserEntity, "blockedUsers")
      .of(blocker)
      .add(user);
  }

  async unblock(unblocker: UserEntity, username: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    if (user.id === unblocker.id) {
      throw new BadRequestException("You cannot unblock yourself");
    }

    const isAlreadyBlocked = await this.userRepository.exist({
      where: {
        id: unblocker.id,
        blockedUsers: {
          id: user.id,
        },
      },
      relations: {
        blockedUsers: true,
      },
    });

    if (!isAlreadyBlocked) {
      throw new ConflictException(`User not blocked: ${username}`);
    }

    await this.userRepository
      .createQueryBuilder()
      .relation(UserEntity, "blockedUsers")
      .of(unblocker)
      .remove(user);
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({
      username,
    });
  }
}
