import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateDMChannelDto {
  @ApiProperty({
    description: "The username of the user to create a DM channel with",
    example: "dezano",
  })
  @IsString()
  @Length(1, 12)
  user: string;
}
