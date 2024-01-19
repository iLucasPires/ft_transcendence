import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
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
  logger: Logger = new Logger("AppGateway");

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const req = client.request;

    if (!req.isAuthenticated()) {
      client.disconnect(true);
      this.logger.log("Disconnected unauthenticated client");
    }
    this.logger.log(`Client connected: ${req.user.username}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.request.user.username}`);
  }

  @SubscribeMessage("testMessage")
  handleMessage(client: Socket, payload: string): string {
    const { username } = client.request.user;
    console.log(`${username}: ${payload}`);
    return "Hello world!";
  }
}
