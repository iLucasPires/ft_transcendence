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
  isChannelAdmin?: boolean;
  isMuted?: boolean;
};

export type iChannel = {
  id: string;
  name?: string;
  type: "dm" | "group";
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
