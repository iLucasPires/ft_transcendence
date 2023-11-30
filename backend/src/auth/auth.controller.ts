import {
  Controller,
  Get,
  HttpRedirectResponse,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Redirect,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guards/forty-two.guard";
import { Request } from "express";
import { IsAuthenticatedGuard } from "./guards/authenticated.guard";
import { ConfigService } from "@nestjs/config";
import { User } from "src/users/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get("42")
  @UseGuards(FortyTwoAuthGuard)
  connectWith42() {}

  @Get("/42/callback")
  @UseGuards(FortyTwoAuthGuard)
  @Redirect()
  fortyTwoCallback(@Req() req: Request): HttpRedirectResponse {
    const user = req.user as User;

    return {
      statusCode: HttpStatus.FOUND,
      url: user.registrationComplete
        ? this.configService.get<string>("FRONTEND_URL")
        : this.configService.get<string>("FRONTEND_URL") + "/first-login",
    };
  }

  @Post("logout")
  @UseGuards(IsAuthenticatedGuard)
  @Redirect("/login")
  async logout(@Req() request: Request) {
    const logoutError = await new Promise((resolve) =>
      request.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
    );
    if (logoutError) {
      throw new InternalServerErrorException("Could not logout user");
    }
  }
}
