import { ChannelsModule } from "@/channels/channels.module";
import { ConnectionStatusModule } from "@/connection-status/connection-status.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [ChannelsModule, UsersModule, ConnectionStatusModule],
  providers: [ChatGateway],
})
export class ChatModule {}
