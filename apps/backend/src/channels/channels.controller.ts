import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { UsersService } from "@/users/users.service";
import {
  BadRequestException,
  ConflictException,
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { ChannelsService } from "./channels.service";
import { FindChannelDto } from "./dto";

@Controller("channels")
@UseGuards(IsAuthenticatedGuard)
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
  ) {}

  @Post("dm/:username")
  async createDmChannel(@Req() req: Request, @Param("username") username: string): Promise<FindChannelDto> {
    const { user } = req;
    const dmUser = await this.usersService.findOneByUsernameForUser(user, username);

    if (!dmUser) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    if (dmUser.id === user.id) {
      throw new BadRequestException("Cannot create a DM channel with yourself");
    }
    const channel = await this.channelsService.findDmChannel(user, dmUser);
    if (!!channel) {
      throw new ConflictException("DM channel already exists");
    }
    return await this.channelsService.createDmChannel(user, dmUser);
  }
}
