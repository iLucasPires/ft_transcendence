import { Inject } from "@nestjs/common";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GamesService } from "../games.service";
import { MatchmakingService } from "./matchmaking.service";

@WebSocketGateway({
  namespace: "game",
  path: "/api/socket.io",
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @Inject()
  gamesService: GamesService;
  @Inject()
  matchmakingService: MatchmakingService;
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;

    if (!loggedInUser) {
      client.disconnect(true);
      return;
    }
    client.join(loggedInUser.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;

    if (!loggedInUser) {
      return;
    }
    if (this.matchmakingService.isInQueue(loggedInUser)) {
      this.matchmakingService.removeFromQueue(loggedInUser);
    }
  }

  @SubscribeMessage("findGame")
  async handleFindGame(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const opponent = await this.matchmakingService.findOpponent(loggedInUser);

    if (!opponent) {
      this.matchmakingService.addToQueue(loggedInUser, (user) => this.server.to(user.id).emit("matchmakingTimeout"));
      this.server.to(loggedInUser.id).emit("waitingInQueue");
      return;
    }
    this.matchmakingService.removeFromQueue(opponent);
    const game = await this.gamesService.createGame(loggedInUser.id, opponent.id);
    this.server.to([loggedInUser.id, opponent.id]).emit("matchFound", game);
  }

  @SubscribeMessage("leaveQueue")
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    this.matchmakingService.removeFromQueue(loggedInUser);
    return "ok";
  }
}
