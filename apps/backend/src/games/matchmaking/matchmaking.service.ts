import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class MatchmakingService {
  private queue: UserEntity[] = [];

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
}
