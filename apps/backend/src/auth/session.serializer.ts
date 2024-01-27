import { UserWithSession } from "@/users/interfaces";
import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { SessionData } from "express-session";

type PassportSession = SessionData["passport"]["user"];

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: Function): void {
    const { id, isTwoFactorAuthEnabled } = user;
    const userSession: PassportSession = { id, isTwoFactorAuthEnabled };

    if (isTwoFactorAuthEnabled) {
      userSession.isTwoFactorAuthApproved = false;
    }

    done(null, userSession);
  }

  async deserializeUser({ id, ...session }: PassportSession, done: Function): Promise<void> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      return done(`Could not deserialize user: user with ${id} could not be found`, null);
    }

    const userWithSession: UserWithSession = { ...user };

    if (user.isTwoFactorAuthEnabled) {
      userWithSession.isTwoFactorAuthApproved = session.isTwoFactorAuthApproved ?? false;
    }

    done(null, userWithSession);
  }
}
