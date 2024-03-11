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
import type { Server, Socket } from "socket.io";
import { GamesService } from "./games.service";

@WebSocketGateway({
  namespace: "game",
  path: "/api/socket.io",
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @Inject()
  gamesService: GamesService;

  handleConnection(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;

    if (!loggedInUser) {
      client.disconnect(true);
      return;
    }
    client.join(loggedInUser.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;

    if (!loggedInUser) {
      return;
    }
    let opponentId: string;
    const room = this.gamesService.findRoomByPlayer(loggedInUser.id);
    if (!room) {
      return;
    }
    if (room.leftPlayerId === loggedInUser.id) {
      opponentId = room.rightPlayerId;
    } else {
      opponentId = room.leftPlayerId;
    }
    this.server.to(opponentId).emit("matchTerminated", { reason: "The opposing player has left the game" });
    await this.gamesService.terminateGame(room.gameId, room.state.score);
  }

  @SubscribeMessage("playerReady")
  async handleStartGame(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const room = this.gamesService.findRoomByPlayer(loggedInUser.id);

    if (!room) {
      throw new WsException("Player is not in an existing room");
    }
    if (room.state.started) {
      throw new WsException("The game has already started");
    }
    if (loggedInUser.id === room.leftPlayerId) {
      room.state.leftPlayerReady = true;
    } else {
      room.state.rightPlayerReady = true;
    }
    if (room.state.leftPlayerReady && room.state.rightPlayerReady) {
      await this.gamesService.startGame(this.server, room.gameId);
    }
  }

  @SubscribeMessage("keyPress")
  handleKeyPress(@ConnectedSocket() client: Socket, @MessageBody() keyCode: string) {
    const loggedInUser = client.request.user;
    const room = this.gamesService.findRoomByPlayer(loggedInUser.id);

    if (!room) {
      throw new WsException("Player is not in an existing room");
    }
    if (!room.state.started) {
      throw new WsException("The game hasn't been started yet");
    }
    if (keyCode === "ArrowUp") {
      if (loggedInUser.id === room.leftPlayerId) {
        room.state.leftPlayerMovement = "up";
      } else {
        room.state.rightPlayerMovement = "up";
      }
    } else if (keyCode === "ArrowDown") {
      if (loggedInUser.id === room.leftPlayerId) {
        room.state.leftPlayerMovement = "down";
      } else {
        room.state.rightPlayerMovement = "down";
      }
    }
  }

  @SubscribeMessage("keyRelease")
  handleKeyRelease(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const room = this.gamesService.findRoomByPlayer(loggedInUser.id);

    if (!room) {
      throw new WsException("Player is not in an existing room");
    }
    if (!room.state.started) {
      throw new WsException("The game hasn't been started yet");
    }
    if (loggedInUser.id === room.leftPlayerId) {
      room.state.leftPlayerMovement = "idle";
    } else {
      room.state.rightPlayerMovement = "idle";
    }
  }

  @SubscribeMessage("leaveGame")
  async handleForfeitGame(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const room = this.gamesService.findRoomByPlayer(loggedInUser.id);

    if (!room) {
      throw new WsException("Player is not in an existing room");
    }
    const opponentId = loggedInUser.id === room.leftPlayerId ? room.rightPlayerId : room.leftPlayerId;
    this.server.to(opponentId).emit("matchTerminated", { reason: "The opposing player has left the game" });
    await this.gamesService.terminateGame(room.gameId, room.state.score);
  }
}
