import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "The user's new username",
    example: "dezano",
  })
  @IsString()
  @Length(1, 12)
  username: string;
}
