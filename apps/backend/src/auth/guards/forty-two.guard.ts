import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard("forty-two") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;

    await super.logIn(request);
    response.cookie("connect.flag", 1, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return true;
  }
}
