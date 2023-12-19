import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRequest } from "src/users/interfaces";

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as UserRequest;
    return req.isAuthenticated();
  }
}
