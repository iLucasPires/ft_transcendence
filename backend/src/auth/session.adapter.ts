import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { RequestHandler } from "express";
import * as passport from "passport";
import { Server } from "socket.io";

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

export class SessionAdapter extends IoAdapter {
  constructor(
    private app: NestExpressApplication,
    private sessionMiddleware: RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    server.use(wrap(this.sessionMiddleware));
    server.use(wrap(passport.session()));
    return server;
  }
}
