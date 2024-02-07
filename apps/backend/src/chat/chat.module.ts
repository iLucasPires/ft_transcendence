import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChannelsModule } from "@/channels/channels.module";
import { UsersModule } from "@/users/users.module";

@Module({
  imports: [ChannelsModule, UsersModule],
  providers: [ChatGateway],
})
export class ChatModule {}
