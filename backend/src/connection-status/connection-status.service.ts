import { Injectable } from "@nestjs/common";

@Injectable()
export class ConnectionStatusService {
  private connectedUsers: Array<string> = [];

  addConnectedUser(userId: string) {
    this.connectedUsers.push(userId);
  }

  removeConnectedUser(userId: string) {
    this.connectedUsers = this.connectedUsers.filter((id) => id !== userId);
  }

  isConnected(userId: string) {
    return this.connectedUsers.includes(userId);
  }
}
