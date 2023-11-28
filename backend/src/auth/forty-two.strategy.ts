import { Strategy, VerifyCallback } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { Profile } from "passport";

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(
    "https://api.intra.42.fr/v2/me",
    accessToken,
    (err: Error, body: string) => {
      if (err) {
        return done(err);
      }
      try {
        const json = JSON.parse(body);
        const profile: Profile = {
          id: json.id,
          displayName: json.login,
          emails: [{ value: json.email }],
          provider: "forty-two",
        };
        return done(null, profile);
      } catch (err) {
        return done(err);
      }
    },
  );
};

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, "forty-two") {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: "https://api.intra.42.fr/oauth/authorize",
      tokenURL: "https://api.intra.42.fr/oauth/token",
      clientID: configService.get("FT_CLIENT_ID"),
      clientSecret: configService.get("FT_CLIENT_SECRET"),
      callbackURL: "/api/auth/42/callback",
      scope: ["public"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const user = await this.authService.authenticateUser(profile);
    return done(null, user);
  }
}
