import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./game.entity";
import { GamesService } from "./games.service";
import { MatchmakingGateway } from "./matchmaking/matchmaking.gateway";
import { MatchmakingService } from "./matchmaking/matchmaking.service";
import { GamesGateway } from './games.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UsersModule],
  providers: [MatchmakingGateway, MatchmakingService, GamesService, GamesGateway],
})
export class GamesModule {}
