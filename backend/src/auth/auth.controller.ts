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
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { IsAuthenticatedGuard } from "./guards/authenticated.guard";
import { FortyTwoAuthGuard } from "./guards/forty-two.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get("42")
  @UseGuards(FortyTwoAuthGuard)
  connectWith42() {}

  @Get("/42/callback")
  @UseGuards(FortyTwoAuthGuard)
  @Redirect()
  fortyTwoCallback(): HttpRedirectResponse {
    return {
      statusCode: HttpStatus.FOUND,
      url: this.configService.get<string>("FRONTEND_URL"),
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
