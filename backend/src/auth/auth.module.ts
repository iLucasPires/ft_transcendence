import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { FortyTwoStrategy } from "./forty-two.strategy";
import * as passport from "passport";
import * as expressSession from "express-session";
import { SessionSerializer } from "./session.serializer";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      session: true,
    }),
    UsersModule,
  ],
  providers: [AuthService, FortyTwoStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        expressSession({
          secret: this.configService.get("SESSIONS_SECRET"),
          resave: false,
          saveUninitialized: false,
        }),
        passport.session(),
      )
      .forRoutes("*");
  }
}
