import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class TwoFactorAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;

    if (!req.isAuthenticated()) {
      return false;
    }

    const { isTwoFactorAuthEnabled, isTwoFactorAuthApproved } = req.user;

    if (isTwoFactorAuthEnabled) {
      return isTwoFactorAuthApproved;
    }

    return true;
  }
}
