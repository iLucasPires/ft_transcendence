import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { UsersService } from "@/users/users.service";
import { Inject } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
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
  connectionStatusService: ConnectionStatusService;
  @Inject()
  gamesService: GamesService;
  @Inject()
  matchmakingService: MatchmakingService;
  @Inject()
  usersService: UsersService;
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
    const invite = this.matchmakingService.findUserInvite(loggedInUser);
    if (invite) {
      const opponentId = invite.from.id === loggedInUser.id ? invite.to.id : invite.from.id;
      this.server.to(opponentId).emit("inviteCancelled", "The opponent has disconnected");
      this.matchmakingService.removeInvite(invite.id);
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

  @SubscribeMessage("inviteToGame")
  async handlePrivateGame(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const opponent = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!opponent) {
      throw new WsException("Opponent not found");
    }
    if (!this.connectionStatusService.isConnected(opponent.id)) {
      throw new WsException("Couldn't invite user, user is offline");
    }
    if (!!this.matchmakingService.findUserInvite(opponent)) {
      throw new WsException("Couldn't invite user, user is answering another invite");
    }
    if (!!this.gamesService.findRoomByPlayer(opponent.id)) {
      throw new WsException("Couldn't invite user, user is already in a game");
    }
    const invite = this.matchmakingService.createInvite(loggedInUser, opponent, ({ from, to }) => {
      this.server.to(to.id).emit("inviteTimeout");
      this.server.to(from.id).emit("inviteTimeout", opponent.username);
    });
    this.server.to(opponent.id).emit("gameInvite", invite);
  }

  @SubscribeMessage("acceptInvite")
  async handleAcceptInvite(@ConnectedSocket() client: Socket, @MessageBody() inviteId: string) {
    const loggedInUser = client.request.user;
    const invite = this.matchmakingService.findInviteById(inviteId);

    if (!invite) {
      throw new WsException("Invite not found");
    }

    const game = await this.gamesService.createGame(loggedInUser.id, invite.from.id);

    this.server.to([loggedInUser.id, invite.from.id]).emit("privateGameCreated", game);
    this.matchmakingService.removeInvite(inviteId);
  }

  @SubscribeMessage("rejectInvite")
  async handleRejectInvite(@ConnectedSocket() client: Socket, @MessageBody() inviteId: string) {
    const loggedInUser = client.request.user;
    const invite = this.matchmakingService.findInviteById(inviteId);

    if (!invite) {
      throw new WsException("Invite not found");
    }

    this.server.to(invite.from.id).emit("inviteRejected", loggedInUser.username);
    this.matchmakingService.removeInvite(inviteId);
  }
}
