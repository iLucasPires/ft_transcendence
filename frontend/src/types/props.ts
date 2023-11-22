export type iHistory = {
  lobby: String;
  players: String;
  scoreboard: String;
};

export type iUser = {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
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
