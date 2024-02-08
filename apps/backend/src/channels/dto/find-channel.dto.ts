import { FindUserDto } from "@/users/dto";

export class FindChannelDto {
  id: string;
  type: "dm";
  createdAt: Date;
  updatedAt: Date;
  members: Array<FindUserDto>;
}
