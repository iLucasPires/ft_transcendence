import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class VerifyCodeDto {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ description: "OTP Code for 2FA" })
  code: string;
}
