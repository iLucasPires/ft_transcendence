import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TwoFactorAuthController } from "./2fa.controller";
import { TwoFactorAuthService } from "./2fa.service";

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [TwoFactorAuthService],
  controllers: [TwoFactorAuthController],
})
export class TwoFactorAuthModule {}
