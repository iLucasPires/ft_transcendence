import { IsNumberString, IsOptional, Max, Min } from "class-validator";

export class ListUsersDto {
  @IsOptional()
  @IsNumberString()
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  @IsNumberString()
  @Min(0)
  offset: number;
}
