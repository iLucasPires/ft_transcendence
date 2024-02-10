import { FindUserDto } from "@/users/dto";

export class MessageDto {
  id: string;
  author: Pick<FindUserDto, "id" | "username" | "avatarUrl">;
  channelId: string;
  content: string;
  sentAt: Date;
}
