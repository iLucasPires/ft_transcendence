import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { randomUUID } from "node:crypto";

type Invite = {
  id: string;
  from: Pick<UserEntity, "id" | "username" | "avatarUrl">;
  to: Pick<UserEntity, "id" | "username" | "avatarUrl">;
};

@Injectable()
export class MatchmakingService {
  private queue: UserEntity[] = [];
  private invites: Invite[] = [];

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly usersService: UsersService,
  ) {}

  addToQueue(user: UserEntity, onTimeout: (user: UserEntity) => void) {
    this.queue.push(user);

    const timeout = setTimeout(
      (user) => {
        this.removeFromQueue(user);
        onTimeout(user);
      },
      5 * 60 * 1000,
      user,
    );
    this.schedulerRegistry.addTimeout(`removeFromQueue-${user.id}`, timeout);
  }

  removeFromQueue(user: UserEntity) {
    this.queue = this.queue.filter((u) => u.id !== user.id);
    this.schedulerRegistry.deleteTimeout(`removeFromQueue-${user.id}`);
  }

  isInQueue(user: UserEntity) {
    return this.queue.some((u) => u.id === user.id);
  }

  async findOpponent(loggedInUser: UserEntity) {
    const opponents = this.queue.filter((user) => user.id !== loggedInUser.id);
    const hasBlockingRelationResults = await Promise.all(
      opponents.map(
        async (opponent) =>
          (await this.usersService.isBlockedBy(loggedInUser, opponent)) ||
          (await this.usersService.isBlockedBy(opponent, loggedInUser)),
      ),
    );
    return opponents.find((_, index) => !hasBlockingRelationResults[index]);
  }

  createInvite(from: UserEntity, to: UserEntity, onTimeout: (invite: Invite) => void): Invite {
    const invite = {
      id: randomUUID(),
      from: { id: from.id, username: from.username, avatarUrl: from.avatarUrl },
      to: { id: to.id, username: to.username, avatarUrl: to.avatarUrl },
    };
    const timeout = setTimeout(
      (invite) => {
        onTimeout(invite);
        this.removeInvite(invite.id);
      },
      60 * 1000,
      invite,
    );

    this.invites.push(invite);
    this.schedulerRegistry.addTimeout(`remove-invite-${invite.id}`, timeout);
    return invite;
  }

  findInviteById(inviteId: string) {
    return this.invites.find((invite) => invite.id === inviteId);
  }

  removeInvite(inviteId: string) {
    this.invites = this.invites.filter((invite) => invite.id !== inviteId);
    if (this.schedulerRegistry.doesExist("timeout", `remove-invite-${inviteId}`)) {
      this.schedulerRegistry.deleteTimeout(`remove-invite-${inviteId}`);
    }
  }
}
