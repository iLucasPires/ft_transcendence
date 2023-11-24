import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Redirect,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guards/forty-two.guard";
import { Request } from "express";
import { IsAuthenticatedGuard } from "./guards/authenticated.guard";

@Controller("auth")
export class AuthController {
  @Get("42")
  @UseGuards(FortyTwoAuthGuard)
  connectWith42() {}

  @Get("/42/callback")
  @UseGuards(FortyTwoAuthGuard)
  @Redirect("/")
  fortyTwoCallback() {}

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
