import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user.username);
  }

  async deserializeUser(username: string, done: Function) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      return done(
        `Could not deserialize user: user with ${username} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
