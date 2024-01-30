import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { RequestHandler } from "express";
import * as passport from "passport";
import { Server } from "socket.io";

export class SessionAdapter extends IoAdapter {
  constructor(
    private app: NestExpressApplication,
    private sessionMiddleware: RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    server.engine.use(this.sessionMiddleware);
    server.engine.use(passport.session());
    return server;
  }
}
