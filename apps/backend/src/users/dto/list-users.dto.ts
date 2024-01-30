import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class ListUsersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number;
}
