import { ApiResponseProperty } from "@nestjs/swagger";

export class UserSessionDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String, example: "dezano" })
  username: string;

  @ApiResponseProperty({ type: String, example: "dezano@42sp.org.br" })
  email: string;

  @ApiResponseProperty({ type: String, example: "/api/files/abcdef12345.jpg" })
  avatarUrl?: string;

  @ApiResponseProperty({ type: Boolean, example: false })
  registrationComplete: boolean;

  @ApiResponseProperty({ type: Boolean, example: true })
  isTwoFactorAuthEnabled: boolean;

  @ApiResponseProperty({ type: Boolean, example: false })
  isTwoFactorAuthApproved?: boolean;
}
