import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { IsAuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { UserRequest } from "../users/interfaces";
import { Response } from "express";
import { ApiProduces, ApiResponse } from "@nestjs/swagger";

@Controller("/auth/2fa")
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post("generate")
  @UseGuards(IsAuthenticatedGuard)
  @ApiProduces("image/png")
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Generated new 2FA secret for user.",
  })
  async generate2FASecret(@Req() req: UserRequest, @Res() res: Response) {
    const user = req.user;
    const otpAuthUrl = await this.twoFactorAuthService.generate2faSecret(user);

    await this.twoFactorAuthService.pipeQrCodeToStream(res, otpAuthUrl);
  }
}
