import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  Max,
  Min,
} from "class-validator";

export class ListUsersDto {
  @IsOptional()
  @IsBoolean()
  blocked: boolean;

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
