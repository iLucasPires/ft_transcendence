import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserEntity } from "../users/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserEntity, done: Function): void {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: Function): Promise<void> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      return done(
        `Could not deserialize user: user with ${id} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
