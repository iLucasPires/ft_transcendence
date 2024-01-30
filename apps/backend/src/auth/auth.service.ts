import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { Profile } from "passport";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async authenticateUser(userProfile: Profile): Promise<UserEntity> {
    const {
      id: _intraId,
      displayName: intraLogin,
      emails: [{ value: email }],
    } = userProfile;

    const user = this.usersService.findOrCreate({
      username: intraLogin,
      intraId: parseInt(_intraId),
      email,
    });

    return user;
  }
}
