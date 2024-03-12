import { ConnectionStatusModule } from "@/connection-status/connection-status.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./game.entity";
import { GamesController } from "./games.controller";
import { GamesGateway } from "./games.gateway";
import { GamesService } from "./games.service";
import { MatchmakingGateway } from "./matchmaking/matchmaking.gateway";
import { MatchmakingService } from "./matchmaking/matchmaking.service";

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UsersModule, ConnectionStatusModule],
  providers: [MatchmakingGateway, MatchmakingService, GamesService, GamesGateway],
  controllers: [GamesController],
})
export class GamesModule {}
