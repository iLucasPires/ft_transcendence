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
@ApiCookieAuth("connect.sid")
@UseGuards(IsAuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
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
  findMany(
    @Req() req: Request,
    @Query() listUsersDto: ListUsersDto,
  ): Promise<UserEntity[]> {
    return this.usersService.findMany(req.user as UserEntity, listUsersDto);
  }

  @Get(":username")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  findOne(@Param("username") username: string): Promise<UserEntity> {
    return this.usersService.findOneByUsername(username);
  }
  @Post(":username/block")
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
  async block(@Req() req: Request, @Param("username") username: string) {
    await this.usersService.block(req.user as UserEntity, username);
  }

  @Post(":username/unblock")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "User unblocked successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User cannot unblock itself.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User already unblocked.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblock(@Req() req: Request, @Param("username") username: string) {
    await this.usersService.unblock(req.user as UserEntity, username);
  }

  @Post(":username/friend")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "User added successfully as friend.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User cannot add itself.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Friendship already exists.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFriend(@Req() req: Request, @Param("username") username: string) {
    await this.usersService.addFriend(req.user as UserEntity, username);
  }

  @Post(":username/unfriend")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "User removed successfully as friend.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User cannot unfriend itself.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "The friendship doesn't exist.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFriend(@Req() req: Request, @Param("username") username: string) {
    await this.usersService.removeFriend(req.user as UserEntity, username);
  }
}
