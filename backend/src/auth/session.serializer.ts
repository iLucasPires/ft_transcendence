import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

type SessionData = { userId: string } & (
  | { isTwoFactorAuthEnabled: false }
  | { isTwoFactorAuthEnabled: true; isTwoFactorAuthApproved: boolean }
);

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: Function): void {
    const { id: userId, isTwoFactorAuthEnabled } = user;
    const userSession = { userId, isTwoFactorAuthEnabled };

    if (!!isTwoFactorAuthEnabled) {
      done(null, {
        ...userSession,
        isTwoFactorAuthApproved: false,
      });
    } else {
      done(null, userSession);
    }
  }

  async deserializeUser(
    { userId, ...session }: SessionData,
    done: Function,
  ): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return done(
        `Could not deserialize user: user with ${userId} could not be found`,
        null,
      );
    }

    // NOTE: We spread session last, otherwise a user will lose access after
    // turning on 2FA.
    done(null, { ...user, ...session });
  }
}
