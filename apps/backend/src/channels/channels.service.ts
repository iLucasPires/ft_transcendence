import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDMChannelDto } from "./dto/create-dm-channel.dto";
import { UsersService } from "@/users/users.service";
import { UserEntity } from "@/users/user.entity";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    private userService: UsersService,
  ) {}

  async createDmChannel(loggedInUser: UserEntity, createDMChannelDto: CreateDMChannelDto): Promise<ChannelEntity> {
    const user = await this.userService.findOneByUsername(createDMChannelDto.user);
    const channel = this.channelsRepository.create({
      type: "dm",
      members: [loggedInUser, user],
    });
    return await this.channelsRepository.save(channel);
  }
}
