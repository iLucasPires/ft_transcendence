import { ApiResponseProperty } from "@nestjs/swagger";
import { StatusType, statusTypes } from "../game.entity";

export class PlayerDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String, example: "dezano" })
  username: string;

  @ApiResponseProperty({ type: String })
  avatarUrl?: string;
}

export class ScoreDto {
  @ApiResponseProperty({ type: Number })
  leftPlayer: number;

  @ApiResponseProperty({ type: Number })
  rightPlayer: number;
}

export class FindGameDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: PlayerDto })
  leftPlayer: PlayerDto;

  @ApiResponseProperty({ type: PlayerDto })
  rightPlayer: PlayerDto;

  @ApiResponseProperty({ type: String, enum: statusTypes })
  status: StatusType;

  @ApiResponseProperty({ type: PlayerDto })
  winner?: PlayerDto;

  @ApiResponseProperty({ type: ScoreDto })
  score: ScoreDto;

  @ApiResponseProperty({ type: String, enum: ["In Progress", "Victory", "Defeat", "Terminated"] })
  result: "In Progress" | "Victory" | "Defeat" | "Terminated";

  @ApiResponseProperty({ type: Date })
  startedAt?: Date;

  @ApiResponseProperty({ type: Date })
  endedAt?: Date;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  @ApiResponseProperty({ type: Date })
  updatedAt: Date;
}
