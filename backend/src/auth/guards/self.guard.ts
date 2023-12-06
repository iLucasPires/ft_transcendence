import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserEntity } from "src/users/user.entity";

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const user = request.user as UserEntity;
    const username = request.url.split("/").at(-1);

    return user.username === username;
  }
}
