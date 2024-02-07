import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity } from "./channel.entity";
import { UsersModule } from "@/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity]), UsersModule],
  providers: [ChannelsService],
})
export class ChannelsModule {}
