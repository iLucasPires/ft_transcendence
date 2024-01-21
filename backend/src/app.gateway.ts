import { Server, Socket } from "socket.io";
import { Logger, UseGuards, Inject } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { WsGuard } from "./auth/guards/ws.guard";
import { ConnectionStatusService } from "./connection-status/connection-status.service";

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

  @Inject()
  connectionStatusService: ConnectionStatusService;

  async handleConnection(client: Socket) {
    const req = client.request;

    if (!req.isAuthenticated()) {
      client.disconnect(true);
      this.logger.log("Disconnected unauthenticated client");
    }
    this.connectionStatusService.addConnectedUser(req.user.id);
    this.logger.log(`Client connected: ${req.user.username}`);
  }

  async handleDisconnect(client: Socket) {
    const { user } = client.request;
    this.logger.log(`Client disconnected: ${user.username}`);
    this.connectionStatusService.removeConnectedUser(user.id);
  }

  @SubscribeMessage("testMessage")
  handleMessage(client: Socket, payload: string): string {
    const { username } = client.request.user;
    this.logger.log(`${username}: ${payload}`);
    return "Hello world!";
  }
}
