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

export type iMember = Pick<iUser, "id" | "username" | "avatarUrl" | "isFriendsWith" | "isConnected"> & {
  isBlocked: boolean;
  isBlockedBy: boolean;
  isChannelAdmin?: boolean;
  isMuted?: boolean;
};

export type iChannel = {
  id: string;
  name?: string;
  type: "dm" | "group";
  visibility: "dm" | "public" | "private";
  owner?: Pick<iUser, "id" | "username">;
  isChannelAdmin?: boolean;
  members: iMember[];
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

export type iChannelSearchResult = {
  id: string;
  name: string;
  type: "dm" | "group";
  tags: string[];
  imageUrl?: string;
};

export type iChatException = {
  status: string;
  message: string;
};

export type iGame = {
  id: string;
  status: "pending" | "in_progress" | "finished" | "terminated";
  leftPlayer: Pick<iUser, "id" | "username" | "avatarUrl">;
  rightPlayer: Pick<iUser, "id" | "username" | "avatarUrl">;
  winner?: Pick<iUser, "id" | "username" | "avatarUrl">;
  score: Score;
  result: "In Progress" | "Victory" | "Defeat" | "Terminated";
  startedAt: string;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
};

type Score = { leftPlayer: number; rightPlayer: number };

type Coordinates = { x: number; y: number };

export type iGameState = {
  score: Score;
  leftPlayerY: number;
  rightPlayerY: number;
  ballPosition: Coordinates;
};

export type iGameResult = {
  score: Score;
  winnerId: string;
};

export type iMap = "classic" | "soccer" | "tennis-green" | "tennis-orange";

export type iGameInvite = {
  id: string;
  from: Pick<iUser, "id" | "username" | "avatarUrl">;
  to: Pick<iUser, "id" | "username" | "avatarUrl">;
};
