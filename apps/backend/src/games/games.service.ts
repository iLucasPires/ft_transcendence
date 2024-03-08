import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "socket.io";
import { Repository } from "typeorm";
import { GameEntity } from "./game.entity";

const randomNumber = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min + 1) + min);
};

type Score = {
  leftPlayer: number;
  rightPlayer: number;
};

type Coordinates = {
  x: number;
  y: number;
};

type PaddleMovement = "up" | "down" | "idle";

class GameState {
  started: boolean = false;
  score: Score = { leftPlayer: 0, rightPlayer: 0 };
  leftPlayerY: number = 270;
  rightPlayerY: number = 270;
  leftPlayerMovement: PaddleMovement = "idle";
  rightPlayerMovement: PaddleMovement = "idle";
  leftPlayerReady: boolean = false;
  rightPlayerReady: boolean = false;
  ballPosition: Coordinates = { x: 400, y: 300 };
  ballSpeed: Coordinates;

  constructor() {
    this.ballSpeed = {
      x: Math.round(Math.random()) ? 10 : -10,
      y: randomNumber(-10, 10),
    };
  }
}

type GameRoom = {
  gameId: string;
  state: GameState;
  leftPlayerId: string;
  rightPlayerId: string;
};

@Injectable()
export class GamesService {
  private games: Record<string, GameRoom> = {};

  constructor(
    @InjectRepository(GameEntity) private gamesRepository: Repository<GameEntity>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createGame(leftPlayerId: string, rightPlayerId: string) {
    const result = await this.gamesRepository
      .createQueryBuilder("newGame")
      .insert()
      .values({ leftPlayer: { id: leftPlayerId }, rightPlayer: { id: rightPlayerId } })
      .returning("newGame.id")
      .execute();

    const { id: gameId } = result.raw[0];
    const game = await this.selectGames().where("game.id = :id", { id: gameId }).getOne();
    this.games[gameId] = {
      gameId,
      state: new GameState(),
      leftPlayerId,
      rightPlayerId,
    };

    return game;
  }

  async setGameWinner(gameId: string, winnerId) {
    await this.gamesRepository.update(gameId, {
      winner: { id: winnerId },
    });
  }

  private selectGames() {
    return this.gamesRepository
      .createQueryBuilder("game")
      .addSelect([
        "leftPlayer.id",
        "leftPlayer.username",
        "leftPlayer.avatarUrl",
        "rightPlayer.id",
        "rightPlayer.username",
        "rightPlayer.avatarUrl",
      ])
      .leftJoin("game.leftPlayer", "leftPlayer")
      .leftJoin("game.rightPlayer", "rightPlayer");
  }

  findRoomByPlayer(playerId: string) {
    return Object.values(this.games).find(
      ({ leftPlayerId, rightPlayerId }) => playerId === leftPlayerId || playerId === rightPlayerId,
    );
  }

  startGame(server: Server, gameId: string) {
    this.games[gameId].state.started = true;
    const interval = setInterval(() => this.gameLoop(server, this.games[gameId]), 1000 / 30);
    this.schedulerRegistry.addInterval(`game-${gameId}`, interval);
  }

  async gameLoop(server: Server, room: GameRoom) {
    const { gameId, state, leftPlayerId, rightPlayerId } = room;
    const socket = server.to([leftPlayerId, rightPlayerId]);

    this.handleScore(room.state);
    const winnerId = this.getWinnerId(room);
    if (!!winnerId) {
      const loserId = winnerId === leftPlayerId ? leftPlayerId : rightPlayerId;
      await this.setGameWinner(gameId, winnerId);
      server.to(winnerId).emit("victory");
      server.to(loserId).emit("defeat");
      delete this.games[room.gameId];
      this.schedulerRegistry.deleteInterval(`game-${gameId}`);
      return;
    }
    this.handleCollisions(room.state);
    this.handleMovement(room.state);

    socket.emit("gameTick", state);
  }

  private getWinnerId({ state, leftPlayerId, rightPlayerId }: GameRoom) {
    const { score } = state;

    if (score.leftPlayer === 11) {
      return leftPlayerId;
    }
    if (score.rightPlayer === 11) {
      return rightPlayerId;
    }
  }

  private handleCollisions = (state: GameState) => {
    const { x: ballX, y: ballY } = state.ballPosition;

    if (ballY - 8 < 0 || ballY + 8 > 600) {
      state.ballSpeed.x *= 1.1;
      state.ballSpeed.y *= -1.1;
      return;
    }
    const leftPaddleX = 25 + 8;
    const rightPaddleX = 775 - 8;
    const leftPaddleMaxY = state.leftPlayerY + 60;
    const rightPaddleMaxY = state.rightPlayerY + 60;
    if (
      (ballX - 8 < leftPaddleX && ballY > state.leftPlayerY && leftPaddleMaxY > ballY) ||
      (ballX + 8 > rightPaddleX && ballY > state.rightPlayerY && rightPaddleMaxY > ballY)
    ) {
      state.ballSpeed.x *= -1.1;
      state.ballSpeed.y *= 1.1;
    }
  };

  private handleScore(state: GameState) {
    const { x: ballX } = state.ballPosition;
    if (ballX - 8 < 0) {
      state.score.leftPlayer += 1;
      this.resetBall(state);
    } else if (ballX + 8 > 800) {
      state.score.rightPlayer += 1;
      this.resetBall(state);
    }
  }

  private resetBall(state: GameState) {
    state.ballPosition.x = 400;
    state.ballPosition.y = 300;
    state.ballSpeed = {
      x: Math.round(Math.random()) ? 10 : -10,
      y: randomNumber(-10, 10),
    };
  }

  private handleMovement(state: GameState) {
    state.ballPosition.x += state.ballSpeed.x;
    state.ballPosition.y += state.ballSpeed.y;
  }
}
