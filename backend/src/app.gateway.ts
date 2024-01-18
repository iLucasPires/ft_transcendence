import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { WsGuard } from "./auth/guards/ws.guard";

@UseGuards(WsGuard)
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const { user } = client.request;

    if (!user) {
      client.disconnect(true);
    }
  }

  async handleDisconnect() {
    console.log("disconnected");
  }

  @SubscribeMessage("testMessage")
  handleMessage(client: Socket, payload: string): string {
    const { username } = client.request.user;
    console.log(`${username}: ${payload}`);
    return "Hello world!";
  }
}
