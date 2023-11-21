import { Injectable } from "@nestjs/common";
import { Profile } from "passport";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  authenticateUser(userProfile: Profile): Promise<User> {
    const { id: intraId, username, displayName, emails, photos } = userProfile;

    const payload = {
      intraId: parseInt(intraId),
      username,
      displayName,
      email: emails[0].value,
      avatarUrl: photos[0]?.value,
    };

    return this.usersService.findOrCreate(payload);
  }
}
