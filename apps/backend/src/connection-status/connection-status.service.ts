import { Injectable } from "@nestjs/common";

type ConnectedUser = {
  userId: string;
  socketId: string;
};

@Injectable()
export class ConnectionStatusService {
  private connectedUsers: Array<ConnectedUser> = [];

  addConnectedUser(userId: string, socketId: string) {
    this.connectedUsers.push({ userId, socketId });
  }

  removeConnectedUser(userId: string) {
    this.connectedUsers = this.connectedUsers.filter((u) => u.userId !== userId);
  }

  isConnected(userId: string) {
    return this.connectedUsers.some((u) => u.userId === userId);
  }

  getSocketId(userId: string) {
    return this.connectedUsers.find((u) => u.userId === userId)?.socketId;
  }
}
