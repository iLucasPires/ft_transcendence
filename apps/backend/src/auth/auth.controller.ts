import {
  Controller,
  Get,
  HttpRedirectResponse,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { Request, Response } from "express";
import { IsAuthenticatedGuard } from "./guards/authenticated.guard";
import { FortyTwoAuthGuard } from "./guards/forty-two.guard";

@Controller("auth")
@ApiExcludeController()
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
      url: "/",
    };
  }

  @Post("logout")
  @UseGuards(IsAuthenticatedGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    const logoutError = await new Promise((resolve) =>
      request.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
    );
    if (logoutError) {
      throw new InternalServerErrorException("Could not logout user");
    }
    response.clearCookie("connect.sid");
    response.clearCookie("connect.flag");
    response.send();
  }
}
