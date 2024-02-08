import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { FindChannelDto } from "./dto";
import { ConnectionStatusService } from "@/connection-status/connection-status.service";

interface FindUserChannelsQueryResult {
  channel_id: string;
  channel_type: "dm";
  channel_created_at: Date;
  channel_updated_at: Date;
  channel_members: Array<{
    id: string;
    username: string;
    avatarUrl: string;
    isFriendsWith: boolean;
  }>;
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    private connectionStatusService: ConnectionStatusService,
    private userService: UsersService,
  ) {}

  async findUserChannels(user: UserEntity): Promise<FindChannelDto[]> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.createdAt",
        "channel.updatedAt",
        `array_agg(json_build_object('id', m.id, 'username', m.username, 'avatarUrl', m.avatarUrl, 'isFriendsWith', f.friend_1_id IS NOT NULL))
          OVER (PARTITION BY channel.id) AS channel_members`,
      ])
      .distinctOn(["channel.id"])
      .innerJoin("channel_members", "cm", "cm.channel_id = channel.id")
      .innerJoin("users", "m", "m.id = cm.member_id")
      .leftJoin(
        "friendships",
        "f",
        `(f.friend_1_id = :id AND f.friend_2_id = m.id)
          OR
         (f.friend_1_id = m.id AND f.friend_2_id = :id)`,
        { id: user.id },
      )
      .where("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :id)", { id: user.id })
      .getRawMany<FindUserChannelsQueryResult>();

    return result.map((channel) => ({
      id: channel.channel_id,
      type: channel.channel_type,
      members: channel.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: channel.channel_created_at,
      updatedAt: channel.channel_updated_at,
    }));
  }

  async findDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<FindChannelDto | null> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.createdAt",
        "channel.updatedAt",
        `array_agg(json_build_object('id', m.id, 'username', m.username, 'avatarUrl', m.avatarUrl, 'isFriendsWith', f.friend_1_id IS NOT NULL))
          OVER (PARTITION BY channel.id) AS channel_members`,
      ])
      .distinctOn(["channel.id"])
      .innerJoin("channel_members", "cm", "cm.channel_id = channel.id")
      .innerJoin("users", "m", "m.id = cm.member_id")
      .leftJoin(
        "friendships",
        "f",
        `(f.friend_1_id = :id AND f.friend_2_id = m.id)
          OR
         (f.friend_1_id = m.id AND f.friend_2_id = :id)`,
        { id: loggedInUser.id },
      )
      .where("channel.type = 'dm'")
      .andWhere("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :loggedInUserId)", {
        loggedInUserId: loggedInUser.id,
      })
      .andWhere("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :dmUserId)", {
        dmUserId: dmUser.id,
      })
      .getRawOne<FindUserChannelsQueryResult>();

    if (!result) {
      return null;
    }

    return {
      id: result.channel_id,
      type: result.channel_type,
      members: result.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: result.channel_created_at,
      updatedAt: result.channel_updated_at,
    };
  }

  async createDmChannel(loggedInUser: UserEntity, username: string): Promise<ChannelEntity> {
    const dmUser = await this.userService.findOneByUsername(loggedInUser, username);

    if (!dmUser) {
      throw new NotFoundException("User not found");
    }

    const channel = await this.findDmChannel(loggedInUser, dmUser);

    if (!!channel) {
      throw new ConflictException("DM channel already exists");
    }

    const ownUser = {
      id: loggedInUser.id,
      username: loggedInUser.username,
      avatarUrl: loggedInUser.avatarUrl,
    };

    return await this.channelsRepository.save({
      type: "dm",
      members: [ownUser, dmUser],
    });
  }
}
