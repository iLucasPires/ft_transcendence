import { Controller, Get, Redirect, Req, UseGuards } from "@nestjs/common";
import { IsAuthenticatedGuard } from "./auth/guards/authenticated.guard";
import { Request } from "express";

@Controller()
export class AppController {
  @Get()
  @Redirect("/api/docs")
  getDocs() {}

  @Get("/health")
  getHealth() {
    return "OK";
  }

  @Get("/me")
  @UseGuards(IsAuthenticatedGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }
}
