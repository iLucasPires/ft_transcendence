import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async authenticateUser(userProfile: Profile): Promise<User> {
    const {
      id: _intraId,
      username: intraLogin,
      displayName,
      emails: [{ value: email }],
    } = userProfile;

    const payload = {
      username: intraLogin,
      intraId: parseInt(_intraId),
      displayName,
      email,
    };

    return this.usersService.findOrCreate(payload);
  }
}
