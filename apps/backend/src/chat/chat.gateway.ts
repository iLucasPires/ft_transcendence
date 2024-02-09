import { WsGuard } from "@/auth/guards/ws.guard";
import { ChannelsService } from "@/channels/channels.service";
import { HttpExceptionFilter } from "@/http-exception.filter";
import { UsersService } from "@/users/users.service";
import { Inject, Logger, UseFilters, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@UseGuards(WsGuard)
@UseFilters(HttpExceptionFilter)
@WebSocketGateway({
  namespace: "/chat",
  path: "/api/socket.io",
})
export class ChatGateway implements OnGatewayConnection {
  logger = new Logger("ChatGateway");

  @Inject()
  channelsService: ChannelsService;
  @Inject()
  usersService: UsersService;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { request } = client;

    if (!request.isAuthenticated()) {
      this.logger.log("Disconnected unauthorized client");
      client.disconnect(true);
      return;
    }

    const clientChannels = await this.channelsService.findUserChannels(request.user);
    client.join(clientChannels.map((channel) => channel.id));
  }

  @SubscribeMessage("fetchChannels")
  async handleFetchChannels(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const channels = await this.channelsService.findUserChannels(loggedInUser);
    client.emit("channelsList", channels);
  }

  @SubscribeMessage("enterDmChat")
  async handleEnterDmChat(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const user = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }

    let channel = await this.channelsService.findDmChannel(loggedInUser, user);
    if (!channel) {
      channel = await this.channelsService.createDmChannel(loggedInUser, username);
    }
    client.join(channel.id);
    return channel;
  }
}
