import { Socket } from "socket.io";
import { CanActivate, ExecutionContext } from "@nestjs/common";

export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { request } = context.switchToWs().getClient() as Socket;
    return request.isAuthenticated();
  }
}
