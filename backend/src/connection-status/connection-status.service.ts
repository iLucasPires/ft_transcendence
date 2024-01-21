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

  getConnectedUsers() {
    return this.connectedUsers;
  }
}
