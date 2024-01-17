import { Server, Socket } from "socket.io";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("font")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("connected");
  }

  async handleDisconnect(client: Socket) {
    console.log("disconnected");
  }
}
