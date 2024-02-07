import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateDMChannelDto } from "./dto";
import { Request } from "express";
import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { ChannelEntity } from "./channel.entity";

@Controller("channels")
@UseGuards(IsAuthenticatedGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findMany(): Promise<ChannelEntity[]> {
    return this.channelsService.findMany();
  }

  @Post("dm")
  createDmChannel(@Req() req: Request, @Body() createChannelDto: CreateDMChannelDto): Promise<ChannelEntity> {
    return this.channelsService.createDmChannel(req.user, createChannelDto.user);
  }
}
