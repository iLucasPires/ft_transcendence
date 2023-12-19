import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
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
import { ApiBody, ApiProduces, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { VerifyCodeDto } from "./dto";

@Controller("/auth/2fa")
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
  ) {}

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

  @Post("turn-on")
  @UseGuards(IsAuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: VerifyCodeDto })
  async turnOn2FA(@Req() req: UserRequest, @Body() { code }: VerifyCodeDto) {
    const user = req.user;
    const isCodeValid = await this.twoFactorAuthService.validate2faCode(
      user,
      code,
    );

    if (!isCodeValid) {
      throw new ForbiddenException("Invalid 2FA code");
    }

    await this.usersService.turnOnTwoFactorAuth(user);
  }
}
