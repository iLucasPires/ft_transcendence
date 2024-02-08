import { FilesModule } from "@/files/files.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";
import { ChannelsModule } from "@/channels/channels.module";

@Module({
  imports: [UsersModule, FilesModule, ChannelsModule],
  controllers: [MeController],
})
export class MeModule {}
