import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ChannelsService } from "./channels.service";
import { FindChannelDto } from "./dto";

@Controller("channels")
@UseGuards(IsAuthenticatedGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post("dm/:username")
  createDmChannel(@Req() req: Request, @Param("username") username: string): Promise<FindChannelDto> {
    return this.channelsService.createDmChannel(req.user, username);
  }
}
