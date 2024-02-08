import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    private userService: UsersService,
  ) {}

  findUserChannels(user: UserEntity): Promise<ChannelEntity[]> {
    return this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.createdAt",
        "channel.updatedAt",
        "member.id",
        "member.username",
        "member.avatarUrl",
      ])
      .innerJoin("channel.members", "m")
      .innerJoin("channel.members", "member")
      .where("m.id = :id", { id: user.id })
      .getMany();
  }

  async findDmChannel(loggedInUser: UserEntity, dmUser: UserEntity): Promise<ChannelEntity> {
    return await this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.createdAt",
        "channel.updatedAt",
        "member_1.id",
        "member_1.username",
        "member_1.avatarUrl",
        "member_2.id",
        "member_2.username",
        "member_2.avatarUrl",
      ])
      .innerJoin("channel.members", "member_1")
      .innerJoin("channel.members", "member_2")
      .where("channel.type = :type", { type: "dm" })
      .andWhere("member_1.id = :id", { id: loggedInUser.id })
      .andWhere("member_2.id = :id", { id: dmUser.id })
      .getOne();
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
