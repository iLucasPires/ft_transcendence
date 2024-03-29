import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async generate2faSecret(user: UserEntity): Promise<string> {
    const secret = authenticator.generateSecret();
    const appName = this.configService.get("APP_NAME");
    const otpAuthUrl = authenticator.keyuri(user.email, appName, secret);

    await this.usersService.setTwoFactorAuthSecret(user, secret);

    return otpAuthUrl;
  }

  async pipeQrCodeToStream(stream: Response, otpAuthUrl: string) {
    stream.contentType("image/png");
    toFileStream(stream, otpAuthUrl);
  }

  async validate2faCode(user: UserEntity, code: string): Promise<boolean> {
    const secret = (await this.usersService.getTwoFactorAuthSecret(user)) ?? "";
    return authenticator.verify({ secret, token: code });
  }
}
