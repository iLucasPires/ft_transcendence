import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { FindUserDto } from "@/users/dto";
import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ChannelEntity, ChannelType } from "./channel.entity";
import { FindChannelDto, MessageDto } from "./dto";
import { SearchResultDto } from "./dto/SearchResult.dto";
import { FindChannelWithMembersDto } from "./dto/find-channel.dto";
import { MessageEntity } from "./messages.entity";

interface ChannelMember extends FindUserDto {
  isChannelAdmin: boolean;
}

interface FindUserChannelsQueryResult {
  channel_id: string;
  channel_name?: string;
  channel_type: ChannelType;
  owner_id?: string;
  owner_username?: string;
  is_channel_admin: boolean;
  channel_created_at: Date;
  channel_updated_at: Date;
  channel_members: Array<ChannelMember>;
}

interface FindMessageQueryResult {
  message_id: string;
  message_channel_id: string;
  message_content: string;
  message_sent_at: Date;
  author_id: string;
  author_username: string;
  author_avatar_url: string;
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private connectionStatusService: ConnectionStatusService,
    private usersService: UsersService,
  ) {}

  private selectChannels(): SelectQueryBuilder<ChannelEntity> {
    return this.channelsRepository
      .createQueryBuilder("channel")
      .addSelect(["owner.id", "owner.username"])
      .leftJoin("channel.owner", "owner");
  }

  private selectAllChannelsMembers(qb: SelectQueryBuilder<any>, loggedInUserId: string) {
    return qb
      .select([
        "cm.channel_id AS channel_id",
        `array_agg(
          json_build_object(
            'id', m.id,
            'username', m.username,
            'avatarUrl', m.avatarUrl,
            'isFriendsWith', f.friend_1_id IS NOT NULL,
            'isChannelAdmin', EXISTS (SELECT 1 FROM channel_admins WHERE channel_id = cm.channel_id AND admin_id = m.id)
          )
        ) AS channel_members`,
      ])
      .from("channel_members", "cm")
      .leftJoin("users", "m", "m.id = cm.member_id")
      .leftJoin(
        "friendships",
        "f",
        `(f.friend_1_id = :id AND f.friend_2_id = m.id)
          OR
         (f.friend_1_id = m.id AND f.friend_2_id = :id)`,
        { id: loggedInUserId },
      )
      .where(
        `NOT EXISTS (
          SELECT 1 FROM blocked_users bu
          WHERE
            (bu.blocked_id = m.id AND bu.blocker_id = :id)
              OR
            (bu.blocker_id = m.id AND bu.blocked_id = :id)
        )`,
        { id: loggedInUserId },
      )
      .groupBy("cm.channel_id");
  }

  async findUserChannels(user: UserEntity): Promise<FindChannelDto[]> {
    const result = await this.selectChannels()
      .addSelect(
        `EXISTS (SELECT 1 FROM channel_admins WHERE channel_id = channel.id AND admin_id = :loggedInUserId)`,
        "is_channel_admin",
      )
      .leftJoinAndSelect((qb) => this.selectAllChannelsMembers(qb, user.id), "cm", "cm.channel_id = channel.id")
      .where("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :loggedInUserId)")
      .andWhere("channel.type = 'group' OR ARRAY_LENGTH(channel_members, 1) > 1")
      .setParameter("loggedInUserId", user.id)
      .getRawMany<FindUserChannelsQueryResult>();

    return result.map((channel) => ({
      id: channel.channel_id,
      name: channel.channel_name,
      type: channel.channel_type,
      owner: channel.owner_id && {
        id: channel.owner_id,
        username: channel.owner_username,
      },
      isChannelAdmin: channel.is_channel_admin,
      members: channel.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: channel.channel_created_at,
      updatedAt: channel.channel_updated_at,
    }));
  }

  async findChannelById(loggedInUser: UserEntity, channelId: string) {
    const result = await this.selectChannels()
      .addSelect(
        `EXISTS (SELECT 1 FROM channel_admins WHERE channel_id = channel.id AND admin_id = :loggedInUserId)`,
        "is_channel_admin",
      )
      .leftJoinAndSelect((qb) => this.selectAllChannelsMembers(qb, loggedInUser.id), "cm", "cm.channel_id = channel.id")
      .where("channel.id = :channelId", { channelId })
      .setParameter("loggedInUserId", loggedInUser.id)
      .getRawOne<FindUserChannelsQueryResult>();

    return {
      id: result.channel_id,
      name: result.channel_name,
      type: result.channel_type,
      owner: result.owner_id && {
        id: result.owner_id,
        username: result.owner_username,
      },
      isChannelAdmin: result.is_channel_admin,
      members: result.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: result.channel_created_at,
      updatedAt: result.channel_updated_at,
    };
  }

  async findDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<FindChannelWithMembersDto | null> {
    const result = await this.selectChannels()
      .leftJoinAndSelect((qb) => this.selectAllChannelsMembers(qb, loggedInUser.id), "cm", "cm.channel_id = channel.id")
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
      name: result.channel_name,
      type: result.channel_type,
      owner: result.owner_id && {
        id: result.owner_id,
        username: result.owner_username,
      },
      members: result.channel_members.map((member) => {
        delete member.isChannelAdmin;
        return {
          ...member,
          isConnected: this.connectionStatusService.isConnected(member.id),
        };
      }),
      createdAt: result.channel_created_at,
      updatedAt: result.channel_updated_at,
    };
  }
  async createDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<FindChannelWithMembersDto> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .insert()
      .values({ type: "dm" })
      .returning("id")
      .execute();

    await this.channelsRepository
      .createQueryBuilder()
      .relation(ChannelEntity, "members")
      .of(result.raw[0].id)
      .add([loggedInUser, dmUser]);

    return this.findDmChannel(loggedInUser, dmUser);
  }

  async createGroupChannel(name: string, owner: UserEntity): Promise<FindChannelDto> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .insert()
      .values({ name, type: "group" })
      .returning("id")
      .execute();

    await this.channelsRepository.createQueryBuilder().relation(ChannelEntity, "owner").of(result.raw[0].id).set(owner);
    await this.channelsRepository
      .createQueryBuilder()
      .relation(ChannelEntity, "admins")
      .of(result.raw[0].id)
      .add(owner);
    await this.channelsRepository
      .createQueryBuilder()
      .relation(ChannelEntity, "members")
      .of(result.raw[0].id)
      .add([owner]);

    return await this.findChannelById(owner, result.raw[0].id);
  }

  private selectMessages(qb: ReturnType<Repository<MessageEntity>["createQueryBuilder"]>) {
    return qb
      .addSelect(["author.id", "author.username", "author.avatarUrl"])
      .innerJoin("users", "author", "message.author_id = author.id")
      .orderBy("message.sentAt", "ASC");
  }

  async sendMessage(channelId: string, authorId: string, content: string): Promise<MessageDto> {
    const qb = this.messagesRepository.createQueryBuilder("message");
    const insertResult = await qb
      .insert()
      .values({ author: { id: authorId }, channel: { id: channelId }, content })
      .returning("id")
      .execute();

    const rawMessage = await this.selectMessages(qb)
      .where("message.id = :id", { id: insertResult.raw[0].id })
      .getRawOne<FindMessageQueryResult>();

    return {
      id: rawMessage.message_id,
      author: {
        id: rawMessage.author_id,
        username: rawMessage.author_username,
        avatarUrl: rawMessage.author_avatar_url,
      },
      channelId: rawMessage.message_channel_id,
      content: rawMessage.message_content,
      sentAt: rawMessage.message_sent_at,
    };
  }

  async findChannelMessages(channelId: string): Promise<MessageDto[]> {
    const qb = this.messagesRepository.createQueryBuilder("message");

    const result = await this.selectMessages(qb)
      .where("message.channel_id = :channelId", { channelId })
      .getRawMany<FindMessageQueryResult>();

    return result.map((message) => ({
      id: message.message_id,
      author: {
        id: message.author_id,
        username: message.author_username,
        avatarUrl: message.author_avatar_url,
      },
      channelId: message.message_channel_id,
      content: message.message_content,
      sentAt: message.message_sent_at,
    }));
  }

  async searchChannels(loggedInUser: UserEntity, query: string): Promise<SearchResultDto[]> {
    const users = await this.usersService.searchUsers(loggedInUser, query);
    const dmResults: SearchResultDto[] = users.map((user) => {
      const tags = ["dm"];
      if (user.isFriendsWith) {
        tags.push("friend");
      }
      return {
        id: user.id,
        name: user.username,
        type: "dm",
        tags,
        imageUrl: user.avatarUrl,
      };
    });

    const rawGroupChannels = await this.selectChannels()
      .leftJoinAndSelect((qb) => this.selectAllChannelsMembers(qb, loggedInUser.id), "cm", "cm.channel_id = channel.id")
      .where("channel.type = 'group'")
      .andWhere("channel.type = 'group' OR ARRAY_LENGTH(channel_members, 1) > 1")
      .andWhere("channel.name ILIKE :query", { query: `%${query}%` })
      .getRawMany<FindUserChannelsQueryResult>();
    const groupResults = rawGroupChannels.map((channel) => {
      const tags = ["group", `owner: ${channel.owner_username}`];
      const isMember = channel.channel_members.some((member) => member.id === loggedInUser.id);
      if (isMember) {
        tags.push("member");
      }
      return {
        id: channel.channel_id,
        name: channel.channel_name,
        type: channel.channel_type,
        tags,
        imageUrl: null,
      };
    });

    return [...dmResults, ...groupResults];
  }

  async joinGroupChannel(channelId: string, userId: string) {
    await this.channelsRepository.createQueryBuilder().relation(ChannelEntity, "members").of(channelId).add(userId);
  }

  async leaveGroupChannel(channel: ChannelEntity, user: UserEntity) {
    channel.members = channel.members.filter((member) => member.id !== user.id);

    if (channel.members.length === 0) {
      await this.channelsRepository.remove(channel);
      return;
    }
    // TODO: update channel admins
    if (channel.owner.id === user.id) {
      channel.owner = channel.members.find((member) => member.id !== channel.owner.id);
    }
    await this.channelsRepository.save(channel);
  }

  async addChannelAdmin(channelId: string, userId: string) {
    await this.channelsRepository.createQueryBuilder().relation(ChannelEntity, "admins").of(channelId).add(userId);
  }

  async removeChannelAdmin(channelId: string, userId: string) {
    await this.channelsRepository.createQueryBuilder().relation(ChannelEntity, "admins").of(channelId).remove(userId);
  }
}
