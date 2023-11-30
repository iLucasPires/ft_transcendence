import { IsEmail, IsNumberString, IsString, Length } from "class-validator";

export class FindOrCreateUserDto {
  @IsNumberString()
  intraId: number;

  @IsString()
  @Length(1, 12)
  username: string;

  @IsEmail()
  email: string;
}
