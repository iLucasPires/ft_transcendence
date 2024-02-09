import { ApiResponseProperty } from "@nestjs/swagger";

export class FindUserDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String, example: "dezano" })
  username: string;

  @ApiResponseProperty({ type: String })
  avatarUrl?: string;

  @ApiResponseProperty({ type: Boolean, example: false })
  isConnected?: boolean;

  @ApiResponseProperty({ type: Boolean, example: false })
  isFriendsWith?: boolean;
}
