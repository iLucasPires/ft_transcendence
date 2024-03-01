import { ApiProperty } from "@nestjs/swagger";

export class JoinGroupChannelDto {
  @ApiProperty({ type: String, format: "uuid", description: "Id of the group channel" })
  channelId: string;

  @ApiProperty({ type: String, nullable: true, description: "Channel Password for private channels" })
  password?: string;
}
