import { Request } from "express";
import { CanActivate, ExecutionContext } from "@nestjs/common";

export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToWs().getClient().request;

    console.log(request.isAuthenticated());

    return request.isAuthenticated();
  }
}
