import { UsersModule } from "@/users/users.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import * as expressSession from "express-session";
import * as passport from "passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FortyTwoStrategy } from "./forty-two.strategy";
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
          cookie: {
            sameSite: "strict",
            secure: this.configService.get("NODE_ENV") === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
          },
        }),
        passport.session(),
      )
      .forRoutes("*");
  }
}
