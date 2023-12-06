import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ListUsersDto } from "./dto";
import { UserEntity } from "./user.entity";
import { UsersService } from "./users.service";
import { ApiCookieAuth, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiCookieAuth("connect.sid")
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limit of the list of users.",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Offset of the list of users.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "A list of users.",
    type: [UserEntity],
  })
  @UseGuards(IsAuthenticatedGuard)
  findAll(@Query() listUsersDto: ListUsersDto): Promise<UserEntity[]> {
    return this.usersService.findAll(listUsersDto);
  }

  @Get(":username")
  @ApiCookieAuth("connect.sid")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @UseGuards(IsAuthenticatedGuard)
  findOne(@Param("username") username: string): Promise<UserEntity> {
    return this.usersService.findOneByUsername(username);
  }

  @Post(":username/block")
  @ApiCookieAuth("connect.sid")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "User blocked successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User cannot block itself.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User already blocked.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsAuthenticatedGuard)
  async block(@Req() req: Request, @Param("username") username: string) {
    await this.usersService.block(req.user as UserEntity, username);
  }
}
