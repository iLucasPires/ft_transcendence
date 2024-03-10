import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Server } from "socket.io";
import { Repository } from "typeorm";
import { GameEntity } from "./game.entity";

const BALL_RADIUS = 8;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 60;
const LEFT_PADDLE_X = 25;
const RIGHT_PADDLE_X = 775 - 16;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_SPEED = 12;

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
      x: Math.round(Math.random()) ? 5 : -5,
      y: randomNumber(-5, 5),
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
      server.to([winnerId, loserId]).emit("endOfGame", { winnerId });
      delete this.games[room.gameId];
      this.schedulerRegistry.deleteInterval(`game-${gameId}`);
      return;
    }
    this.handleMovement(room.state);
    this.handleBallCollision(room.state);

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

  private setBallSpeed(state: GameState, ballSpeedX: number, ballSpeedY: number) {
    const xDirection = ballSpeedX < 0 ? -1 : 1;
    const yDirection = ballSpeedY < 0 ? -1 : 1;

    state.ballSpeed = {
      x: Math.min(Math.abs(ballSpeedX), 10) * xDirection,
      y: Math.min(Math.abs(ballSpeedY), 10) * yDirection,
    };
  }

  private handleBallCollision = (state: GameState) => {
    const { y: ballY } = state.ballPosition;
    const { x: ballSpeedX, y: ballSpeedY } = state.ballSpeed;

    const isMovingTowardsWall = ballSpeedY < 0 ? ballY - BALL_RADIUS < 0 : ballY + BALL_RADIUS > CANVAS_HEIGHT;
    if (isMovingTowardsWall && (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > CANVAS_HEIGHT)) {
      this.setBallSpeed(state, 1.1 * ballSpeedX, -1.1 * ballSpeedY);
    }
    const collidesWithLeftPlayer = this.checkCollisionWithPaddle(
      state.ballPosition,
      state.ballSpeed,
      LEFT_PADDLE_X + PADDLE_WIDTH,
      state.leftPlayerY,
    );
    const collidesWithRightPlayer = this.checkCollisionWithPaddle(
      state.ballPosition,
      state.ballSpeed,
      RIGHT_PADDLE_X,
      state.rightPlayerY,
    );
    if (collidesWithLeftPlayer) {
      const movementFactor = state.leftPlayerMovement === "up" ? -1 : state.leftPlayerMovement === "down" ? 1 : 0;
      this.setBallSpeed(state, -1.1 * ballSpeedX, 1.1 * ballSpeedY + movementFactor * 0.5);
    }
    if (collidesWithRightPlayer) {
      const movementFactor = state.rightPlayerMovement === "up" ? -1 : state.rightPlayerMovement === "down" ? 1 : 0;
      this.setBallSpeed(state, -1.1 * ballSpeedX, 1.1 * ballSpeedY + movementFactor * 0.5);
    }
  };

  private checkCollisionWithPaddle(
    ballPosition: Coordinates,
    ballSpeed: Coordinates,
    paddleX: number,
    paddleY: number,
  ) {
    const { x: ballX, y: ballY } = ballPosition;
    const { x: ballSpeedX } = ballSpeed;
    if (ballY - BALL_RADIUS > paddleY + PADDLE_HEIGHT || ballY + BALL_RADIUS < paddleY) {
      return false;
    }
    const distanceFromPaddle = Math.abs(ballX - paddleX);
    const isMovingTowardsPaddle = ballSpeedX < 0 ? ballX > paddleX : ballX < paddleX;
    return distanceFromPaddle <= BALL_RADIUS && isMovingTowardsPaddle;
  }

  private handleScore(state: GameState) {
    const { x: ballX } = state.ballPosition;
    if (ballX - BALL_RADIUS <= 0) {
      state.score.rightPlayer += 1;
      this.resetBall(state);
    } else if (ballX + BALL_RADIUS >= CANVAS_WIDTH) {
      state.score.leftPlayer += 1;
      this.resetBall(state);
    }
  }

  private resetBall(state: GameState) {
    state.ballPosition.x = CANVAS_WIDTH / 2;
    state.ballPosition.y = CANVAS_HEIGHT / 2;
    state.ballSpeed = {
      x: Math.round(Math.random()) ? 5 : -5,
      y: randomNumber(-5, 5),
    };
  }

  private handleMovement(state: GameState) {
    state.ballPosition.x += state.ballSpeed.x;
    state.ballPosition.y += state.ballSpeed.y;
    if (state.leftPlayerMovement === "up" && state.leftPlayerY > 0) {
      state.leftPlayerY -= PADDLE_SPEED;
      if (state.leftPlayerY < 0) state.leftPlayerY = 0;
    } else if (state.leftPlayerMovement === "down" && state.leftPlayerY + PADDLE_HEIGHT < CANVAS_HEIGHT) {
      state.leftPlayerY += PADDLE_SPEED;
      if (state.leftPlayerY > CANVAS_HEIGHT) state.leftPlayerY = CANVAS_HEIGHT;
    }
    if (state.rightPlayerMovement === "up" && state.rightPlayerY > 0) {
      state.rightPlayerY -= PADDLE_SPEED;
      if (state.rightPlayerY < 0) state.rightPlayerY = 0;
    } else if (state.rightPlayerMovement === "down" && state.rightPlayerY + PADDLE_HEIGHT < CANVAS_HEIGHT) {
      state.rightPlayerY += PADDLE_SPEED;
      if (state.rightPlayerY > CANVAS_HEIGHT) state.rightPlayerY = CANVAS_HEIGHT;
    }
  }
}
