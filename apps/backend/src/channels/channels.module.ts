import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity } from "./channel.entity";
import { UsersModule } from "@/users/users.module";
import { ChannelsController } from "./channels.controller";
import { ConnectionStatusModule } from "@/connection-status/connection-status.module";

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity]), UsersModule, ConnectionStatusModule],
  providers: [ChannelsService],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {}
