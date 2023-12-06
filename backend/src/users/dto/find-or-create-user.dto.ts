import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString, Length } from "class-validator";

export class FindOrCreateUserDto {
  @ApiProperty({
    description: "The user's intra ID",
    example: 10,
  })
  @IsNumberString()
  intraId: number;

  @ApiProperty({
    description: "The user's username",
    example: "dezano",
  })
  @IsString()
  @Length(1, 12)
  username: string;

  @ApiProperty({
    description: "The user's email",
    example: "dezano@42sp.org.br",
  })
  @IsEmail()
  email: string;
}
