import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "@/users/users.service";
import { UserEntity } from "@/users/user.entity";
import { CreateDMChannelDto } from "./dto";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    private userService: UsersService,
  ) {}

  findMany(): Promise<ChannelEntity[]> {
    return this.channelsRepository
      .createQueryBuilder("channel")
      .select([
        "channel.id",
        "channel.type",
        "channel.created_at",
        "channel.updated_at",
        "member.id",
        "member.username",
        "member.avatarUrl",
      ])
      .leftJoin("channel.members", "member")
      .getMany();
  }

  async createDmChannel(loggedInUser: UserEntity, createDMChannelDto: CreateDMChannelDto): Promise<ChannelEntity> {
    const user = await this.userService.findOneByUsername(loggedInUser, createDMChannelDto.user);
    const channel = this.channelsRepository.create({
      type: "dm",
      members: [loggedInUser, user],
    });
    return await this.channelsRepository.save(channel);
  }
}
