import { Inject, Logger, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "./auth/guards/ws.guard";
import { ConnectionStatusService } from "./connection-status/connection-status.service";

@UseGuards(WsGuard)
@WebSocketGateway({ path: "/api/socket.io" })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  logger: Logger = new Logger("AppGateway");

  @WebSocketServer()
  server: Server;

  @Inject()
  connectionStatusService: ConnectionStatusService;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const req = client.request;

    if (!req.isAuthenticated()) {
      client.disconnect(true);
      this.logger.log("Disconnected unauthenticated client");
      return;
    }
    this.connectionStatusService.addConnectedUser(req.user.id);
    this.logger.log(`Client connected: ${req.user.username}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { user } = client.request;
    this.logger.log(`Client disconnected: ${user.username}`);
    this.connectionStatusService.removeConnectedUser(user.id);
  }
}
