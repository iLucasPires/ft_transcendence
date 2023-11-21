import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./guards/forty-two.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  @Get("42")
  @UseGuards(FortyTwoAuthGuard)
  connectWith42() {}

  @Get("/42/callback")
  @UseGuards(FortyTwoAuthGuard)
  fortyTwoCallback(@Req() req: Request) {
    return req.user;
  }
}
