import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { FindUserDto } from "@/users/dto";
import { UserEntity } from "@/users/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity, ChannelType } from "./channel.entity";
import { FindChannelDto, MessageDto } from "./dto";
import { FindChannelWithMembersDto } from "./dto/find-channel.dto";
import { MessageEntity } from "./messages.entity";

interface FindUserChannelsQueryResult {
  channel_id: string;
  channel_name?: string;
  channel_type: ChannelType;
  owner_id?: string;
  owner_username?: string;
  channel_created_at: Date;
  channel_updated_at: Date;
  channel_members: Array<FindUserDto>;
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
  ) {}

  private selectChannelsForUser(qb: ReturnType<Repository<ChannelEntity>["createQueryBuilder"]>, userId: string) {
    return qb
      .addSelect(["owner.id", "owner.username"])
      .leftJoin("channel.owner", "owner")
      .addSelect(
        `array_agg(
          json_build_object(
            'id', m.id,
            'username', m.username,
            'avatarUrl', m.avatarUrl,
            'isFriendsWith', f.friend_1_id IS NOT NULL
          )
        )`,
        "channel_members",
      )
      .leftJoin("channel_members", "cm", "cm.channel_id = channel.id")
      .leftJoin("users", "m", "m.id = cm.member_id")
      .leftJoin(
        "friendships",
        "f",
        `(f.friend_1_id = :id AND f.friend_2_id = m.id)
          OR
         (f.friend_1_id = m.id AND f.friend_2_id = :id)`,
        { id: userId },
      );
  }

  async findUserChannels(user: UserEntity): Promise<FindChannelDto[]> {
    const qb = this.channelsRepository.createQueryBuilder("channel");

    const result = await this.selectChannelsForUser(qb, user.id)
      .where("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :id)", { id: user.id })
      .groupBy("channel.id, owner.id")
      .getRawMany<FindUserChannelsQueryResult>();

    return result.map((channel) => ({
      id: channel.channel_id,
      name: channel.channel_name,
      type: channel.channel_type,
      owner: channel.owner_id && {
        id: channel.owner_id,
        username: channel.owner_username,
      },
      members: channel.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: channel.channel_created_at,
      updatedAt: channel.channel_updated_at,
    }));
  }

  async findChannelById(loggedInUser: UserEntity, channelId: string) {
    const qb = this.channelsRepository.createQueryBuilder("channel");

    const result = await this.selectChannelsForUser(qb, loggedInUser.id)
      .where("channel.id = :channelId", { channelId })
      .groupBy("channel.id, owner.id")
      .getRawOne<FindUserChannelsQueryResult>();

    return {
      id: result.channel_id,
      name: result.channel_name,
      type: result.channel_type,
      owner: result.owner_id && {
        id: result.owner_id,
        username: result.owner_username,
      },
      members: result.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
      createdAt: result.channel_created_at,
      updatedAt: result.channel_updated_at,
    };
  }

  async findDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<FindChannelWithMembersDto | null> {
    const qb = this.channelsRepository.createQueryBuilder("channel");

    const result = await this.selectChannelsForUser(qb, loggedInUser.id)
      .where("channel.type = 'dm'")
      .andWhere("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :loggedInUserId)", {
        loggedInUserId: loggedInUser.id,
      })
      .andWhere("channel.id IN (SELECT channel_id FROM channel_members WHERE member_id = :dmUserId)", {
        dmUserId: dmUser.id,
      })
      .groupBy("channel.id, owner.id")
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
      members: result.channel_members.map((member) => ({
        ...member,
        isConnected: this.connectionStatusService.isConnected(member.id),
      })),
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

  async createGroupChannel(name: string, owner: UserEntity, members: string[]): Promise<FindChannelDto> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .insert()
      .values({ name, type: "group" })
      .returning("id")
      .execute();

    await this.channelsRepository.createQueryBuilder().relation(ChannelEntity, "owner").of(result.raw[0].id).set(owner);
    await this.channelsRepository
      .createQueryBuilder()
      .relation(ChannelEntity, "members")
      .of(result.raw[0].id)
      .add([owner, ...members.map((id) => ({ id }))]);

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
}
