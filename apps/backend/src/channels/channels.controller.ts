import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateDMChannelDto } from "./dto";
import { Request } from "express";
import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";

@Controller("channels")
@UseGuards(IsAuthenticatedGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findMany() {
    return this.channelsService.findMany();
  }

  @Post("dm")
  createDmChannel(@Req() req: Request, @Body() createChannelDto: CreateDMChannelDto) {
    return this.channelsService.createDmChannel(req.user, createChannelDto);
  }
}
