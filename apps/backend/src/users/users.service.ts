import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { FilesService } from "@/files/files.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindOrCreateUserDto } from "./dto";
import { FindUserDto } from "./dto/find-user.dto";
import { UserEntity } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
    private readonly connectionStatusService: ConnectionStatusService,
  ) {}

  async findOrCreate(findOrCreateUserDto: FindOrCreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      intraId: findOrCreateUserDto.intraId,
    });

    if (!!user) {
      return user;
    }

    return await this.userRepository.save(findOrCreateUserDto);
  }

  async findManyForUser(user: UserEntity): Promise<FindUserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.username",
        "user.avatarUrl",
        `CASE
          WHEN user.id IN (f.friend_1_id, f.friend_2_id)
          THEN true ELSE false
        END AS is_friends_with`,
      ])
      .leftJoin(
        "friendships",
        "f",
        `(f.friend_1_id = :id AND f.friend_2_id = user.id)
          OR
         (f.friend_2_id = :id AND f.friend_1_id = user.id)`,
        { id: user.id },
      )
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
      .getRawMany();

    return users.map((userData) => ({
      id: userData.user_id,
      username: userData.user_username,
      avatarUrl: userData.user_avatar_url,
      isFriendsWith: userData.is_friends_with,
      isConnected: this.connectionStatusService.isConnected(userData.user_id),
    }));
  }

  findBlockedUsers(user: UserEntity): Promise<FindUserDto[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.username", "user.avatarUrl"])
      .innerJoin("user.blockedBy", "blockedBy")
      .where("blockedBy.id = :id", { id: user.id })
      .getMany();
  }

  findOneById(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async findOneByUsernameForUser(user: UserEntity, username: string): Promise<UserEntity | undefined> {
    return await this.userRepository
      .createQueryBuilder("user")
      .where("username = :username", { username })
      .andWhere(
        `NOT EXISTS (
          SELECT 1 FROM blocked_users block
          WHERE (block.blocked_id = :id AND block.blocker_id = user.id)
        )`,
        { id: user.id },
      )
      .getOne();
  }

  async updateUsername(user: UserEntity, username: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        username,
        registrationComplete: true,
      })
      .whereEntity(user)
      .returning("id, username, avatarUrl, registrationComplete, isTwoFactorAuthEnabled")
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

  getTwoFactorAuthSecret(user: UserEntity): Promise<string> {
    return this.userRepository
      .createQueryBuilder("user")
      .select("user.twoFactorAuthSecret", "secret")
      .where("user.id = :id", { id: user.id })
      .getRawOne()
      .then((result) => result.secret);
  }

  async setTwoFactorAuthSecret(user: UserEntity, secret: string): Promise<void> {
    await this.userRepository.update(user.id, { twoFactorAuthSecret: secret });
  }

  async turnOnTwoFactorAuth(user: UserEntity): Promise<void> {
    await this.userRepository.update(user.id, { isTwoFactorAuthEnabled: true });
  }

  async turnOffTwoFactorAuth(user: UserEntity): Promise<void> {
    await this.userRepository.update(user.id, {
      isTwoFactorAuthEnabled: false,
      twoFactorAuthSecret: null,
    });
  }

  async block(blocker: UserEntity, userToBlock: UserEntity): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from("friendships")
      .where("friend_1_id = :id AND friend_2_id = :friendId", {
        id: blocker.id,
        friendId: userToBlock.id,
      })
      .orWhere("friend_1_id = :friendId AND friend_2_id = :id", {
        id: userToBlock.id,
        friendId: blocker.id,
      })
      .execute();
    await this.userRepository.createQueryBuilder().relation(UserEntity, "blockedUsers").of(blocker).add(userToBlock);
  }

  async unblock(unblocker: UserEntity, blockedUser: UserEntity): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .relation(UserEntity, "blockedUsers")
      .of(unblocker)
      .remove(blockedUser);
  }

  async isBlockedBy(user: UserEntity, blocker: UserEntity): Promise<boolean> {
    return await this.userRepository.exists({
      where: {
        id: user.id,
        blockedBy: {
          id: blocker.id,
        },
      },
      relations: {
        blockedBy: true,
      },
    });
  }

  async findFriends(user: UserEntity): Promise<FindUserDto[]> {
    const friends = await this.userRepository
      .createQueryBuilder("user")
      .where(
        `user.id != :id AND EXISTS (
          SELECT 1 FROM friendships friendship
          WHERE
            (friendship.friend_1_id = :id AND friendship.friend_2_id = user.id)
          OR
            (friendship.friend_2_id = :id AND friendship.friend_1_id = user.id)
        )`,
        { id: user.id },
      )
      .getMany();

    return friends.map(({ id, username, avatarUrl }) => ({
      id,
      username,
      avatarUrl,
      isConnected: this.connectionStatusService.isConnected(id),
    }));
  }

  async addFriend(user: UserEntity, userToAdd: UserEntity): Promise<void> {
    await this.userRepository.createQueryBuilder().relation(UserEntity, "friends").of(user).add(userToAdd);
  }

  async removeFriend(user: UserEntity, friendUser: UserEntity) {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from("friendships")
      .where("friend_1_id = :id AND friend_2_id = :friendId", {
        id: user.id,
        friendId: friendUser.id,
      })
      .orWhere("friend_1_id = :friendId AND friend_2_id = :id", {
        id: user.id,
        friendId: friendUser.id,
      })
      .execute();
  }

  async isFriendsWith(user: UserEntity, friend: UserEntity): Promise<boolean> {
    return await this.userRepository.exists({
      where: [
        {
          id: user.id,
          friends: {
            id: friend.id,
          },
        },
        {
          id: friend.id,
          friends: {
            id: user.id,
          },
        },
      ],
      relations: {
        friends: true,
      },
    });
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({
      username,
    });
  }
}
