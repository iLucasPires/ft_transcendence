export type iHistory = {
  lobby: String;
  players: String;
  scoreboard: String;
};

export type iUser = {
  username: string;
  email: string;
  id: string;
  isFriendsWith: boolean;
  displayName: string;
  registrationComplete: boolean;
  avatarUrl: string;
  isTwoFactorAuthEnabled: boolean;
  isTwoFactorAuthApproved: boolean;
  isConnected: boolean;
};

export type iChannel = {
  id: string;
  type: "dm";
  members: Pick<iUser, "id" | "username" | "avatarUrl">[];
  createdAt: string;
  updatedAt: string;
};

export type iMessage = {
  id?: string;
  author: Pick<iUser, "id" | "username" | "avatarUrl">;
  channelId: string;
  content: string;
  sentAt: string;
};

export type iCurrentChannel = iChannel & {
  messages: iMessage[];
};
