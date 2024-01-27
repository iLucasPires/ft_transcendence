import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { UsersService } from "@/users/users.service";
import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiProduces, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { TwoFactorAuthService } from "./2fa.service";
import { VerifyCodeDto } from "./dto";

@Controller("/auth/2fa")
@ApiCookieAuth("connect.sid")
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
  async generate2FASecret(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const otpAuthUrl = await this.twoFactorAuthService.generate2faSecret(user);

    await this.twoFactorAuthService.pipeQrCodeToStream(res, otpAuthUrl);
  }

  @Post("turn-on")
  @UseGuards(IsAuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: VerifyCodeDto })
  async turnOn2FA(@Req() req: Request, @Body() { code }: VerifyCodeDto) {
    const user = req.user;
    const isCodeValid = await this.twoFactorAuthService.validate2faCode(user, code);

    if (!isCodeValid) {
      throw new ForbiddenException("Invalid 2FA code");
    }

    await this.usersService.turnOnTwoFactorAuth(user);
    req.session.passport.user.isTwoFactorAuthApproved = true;
  }

  @Post("turn-off")
  @UseGuards(IsAuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: VerifyCodeDto })
  async turnOff2FA(@Req() req: Request, @Body() { code }: VerifyCodeDto) {
    const user = req.user;
    const isCodeValid = await this.twoFactorAuthService.validate2faCode(user, code);

    if (!isCodeValid) {
      throw new ForbiddenException("Invalid 2FA code");
    }

    await this.usersService.turnOffTwoFactorAuth(user);
    delete req.session.passport.user.isTwoFactorAuthApproved;
  }

  @Post("verify")
  @UseGuards(IsAuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: VerifyCodeDto })
  async verifyCode(@Req() req: Request, @Body() { code }: VerifyCodeDto) {
    const user = req.user;
    const isCodeValid = await this.twoFactorAuthService.validate2faCode(user, code);

    if (!isCodeValid) {
      throw new ForbiddenException("Invalid 2FA code");
    }

    req.session.passport.user.isTwoFactorAuthApproved = true;
  }
}
