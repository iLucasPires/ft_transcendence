import { Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  namespace: "/chat",
  path: "/api/socket.io",
})
export class ChatGateway implements OnGatewayConnection {
  logger = new Logger("ChatGateway");

  handleConnection(@ConnectedSocket() client: Socket) {
    const { request } = client;

    if (!request.isAuthenticated()) {
      return;
    }

    this.logger.log(`New user in chat page: ${request.user.username}`);
  }
}
