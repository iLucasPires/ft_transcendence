export type iHistory = {
  lobby: String;
  players: String;
  scoreboard: String;
};

export type iUser = {
  username: string;
  email: string;
  intraId: number;
  displayName: string;
  registrationComplete: boolean;
  avatarUrl: string | null;
};

export type iFriend = {
  id: number;
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
};

export interface iAchievement {
  name: string;
  url: string;
}
