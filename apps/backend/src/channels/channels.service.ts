import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { UserEntity } from "@/users/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { FindChannelDto, MessageDto } from "./dto";
import { MessageEntity } from "./messages.entity";

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

  async findUserChannels(user: UserEntity): Promise<FindChannelDto[]> {
    const result = await this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.createdAt",
        "channel.updatedAt",
        `array_agg(
          json_build_object(
            'id', m.id,
            'username', m.username,
            'avatarUrl', m.avatarUrl,
            'isFriendsWith', f.friend_1_id IS NOT NULL
          )
        ) AS channel_members`,
      ])
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
      .groupBy("channel.id")
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
          AS channel_members`,
      ])
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
      .groupBy("channel.id")
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

  async createDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<FindChannelDto> {
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

  async sendMessage(channelId: string, authorId: string, content: string): Promise<MessageDto> {
    const qb = this.messagesRepository.createQueryBuilder("message");
    const insertResult = await qb
      .insert()
      .values({ author: { id: authorId }, channel: { id: channelId }, content })
      .returning("id")
      .execute();

    const rawMessage = await qb
      .select([
        "message.id",
        "author.id",
        "author.username",
        "author.avatarUrl",
        "message.channel_id AS message_channel_id",
        "message.content",
        "message.sentAt",
      ])
      .innerJoin("users", "author", "author.id = message.author_id")
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
    const result = await this.messagesRepository
      .createQueryBuilder("message")
      .select([
        "message.id",
        "author.id",
        "author.username",
        "author.avatarUrl",
        "message.channel_id",
        "message.content",
        "message.sentAt",
      ])
      .innerJoin("users", "author", "author.id = message.author_id")
      .where("message.channel_id = :channelId", { channelId })
      .orderBy("message.sentAt", "ASC")
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
