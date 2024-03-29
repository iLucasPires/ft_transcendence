import { FindUserDto } from "@/users/dto";
import { ApiResponseProperty } from "@nestjs/swagger";
import { ChannelType, ChannelVisibility, channelTypes, channelVisibility } from "../channel.entity";

export class ChannelMemberDto extends FindUserDto {
  isBlocked: boolean;
  isBlockedBy: boolean;
  isChannelAdmin?: boolean;
  isMuted?: boolean;
}

export class FindChannelDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String })
  name?: string;

  @ApiResponseProperty({ type: String, enum: channelTypes, example: "dm" })
  type: ChannelType;

  @ApiResponseProperty({ type: String, enum: channelVisibility, example: "dm" })
  visibility: ChannelVisibility;

  @ApiResponseProperty({ type: [FindUserDto] })
  owner: Pick<FindUserDto, "id" | "username">;

  isChannelAdmin?: boolean;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  createdAt: Date;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  updatedAt: Date;
}

export class FindChannelWithMembersDto extends FindChannelDto {
  @ApiResponseProperty({ type: [FindUserDto] })
  members: Array<ChannelMemberDto>;
}
