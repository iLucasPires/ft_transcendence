import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ChannelEntity } from "./channel.entity";
import { ChannelsService } from "./channels.service";

@Controller("channels")
@UseGuards(IsAuthenticatedGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findMany(): Promise<ChannelEntity[]> {
    return this.channelsService.findMany();
  }

  @Post("dm/:username")
  createDmChannel(@Req() req: Request, @Param("username") username: string): Promise<ChannelEntity> {
    return this.channelsService.createDmChannel(req.user, username);
  }
}
