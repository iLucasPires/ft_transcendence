import { UseGuards } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@UseGuards(IsAuthenticatedGuard)
@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, req: any) {
    const username = req.user;
    console.log(`Usuário autenticado: ${username}`);

    // Restante do código...
  }
  @SubscribeMessage("private message")
  handlePrivateMessage(client: Socket, data: any) {
    client.to(data.to).emit("private message", {
      from: client.id,
      message: data.message,
    });
  }
}
