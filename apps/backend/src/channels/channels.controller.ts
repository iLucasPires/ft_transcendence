import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { UsersService } from "@/users/users.service";
import {
  BadRequestException,
  Body,
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
import { CreateGroupChannelDto, FindChannelDto } from "./dto";
import { ApiBody } from "@nestjs/swagger";

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

  @Post("groups")
  @ApiBody({ type: CreateGroupChannelDto })
  async createGroupChannel(
    @Req() req: Request,
    @Body() createGroupChannelDto: CreateGroupChannelDto,
  ): Promise<FindChannelDto> {
    const { user } = req;
    const { name } = createGroupChannelDto;

    return await this.channelsService.createGroupChannel(name, user, []);
  }
}
