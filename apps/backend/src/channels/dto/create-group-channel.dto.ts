import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupChannelDto {
  @ApiProperty({ type: String, example: "Zapzap2", description: "Name of the group channel" })
  name: string;

  @ApiProperty({ type: String, nullable: true, description: "Channel Password for private channels" })
  password?: string;
}
