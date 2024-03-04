import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GameEntity } from "./game.entity";

@Injectable()
export class GamesService {
  constructor(@InjectRepository(GameEntity) private gamesRepository: Repository<GameEntity>) {}

  async createGame(leftPlayerId: string, rightPlayerId: string) {
    const result = await this.gamesRepository
      .createQueryBuilder("newGame")
      .insert()
      .values({ leftPlayer: { id: leftPlayerId }, rightPlayer: { id: rightPlayerId } })
      .returning("newGame.id")
      .execute();
    const { id: gameId } = result.raw[0];

    return await this.selectGames().where("game.id = :id", { id: gameId }).getOne();
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
}
