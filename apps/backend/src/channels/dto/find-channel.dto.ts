import { FindUserDto } from "@/users/dto";
import { ApiResponseProperty } from "@nestjs/swagger";
import { ChannelType, channelTypes } from "../channel.entity";

export class FindChannelDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String })
  name?: string;

  @ApiResponseProperty({ type: String, enum: channelTypes, example: "dm" })
  type: ChannelType;

  @ApiResponseProperty({ type: [FindUserDto] })
  owner: Pick<FindUserDto, "id" | "username">;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  createdAt: Date;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  updatedAt: Date;
}

export class FindChannelWithMembersDto extends FindChannelDto {
  @ApiResponseProperty({ type: [FindUserDto] })
  members: Array<FindUserDto>;
}
