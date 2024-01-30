import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
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
export class AuthModule {
  constructor(private readonly configService: ConfigService) {}
}
