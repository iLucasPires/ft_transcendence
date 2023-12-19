import { Module } from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { TwoFactorAuthController } from "./2fa.controller";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [TwoFactorAuthService],
  controllers: [TwoFactorAuthController],
})
export class TwoFactorAuthModule {}
