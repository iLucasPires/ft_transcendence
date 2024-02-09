import { TwoFactorAuthGuard } from "@/auth/guards/2fa.guard";
import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { ListUsersDto } from "./dto";
import { UserEntity } from "./user.entity";
import { UsersService } from "./users.service";
import { FindUserDto } from "./dto/find-user.dto";

@Controller("users")
@ApiCookieAuth("connect.sid")
@UseGuards(TwoFactorAuthGuard)
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
    type: [FindUserDto],
  })
  findMany(@Req() req: Request, @Query() listUsersDto: ListUsersDto): Promise<FindUserDto[]> {
    return this.usersService.findMany(req.user, listUsersDto);
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
  findOne(@Req() req: Request, @Param("username") username: string): Promise<UserEntity> {
    const user = this.usersService.findOneByUsernameForUser(req.user, username);

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    return user;
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
    const { user } = req;
    const userToBlock = await this.usersService.findOneByUsernameForUser(user, username);

    if (!userToBlock) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    if (userToBlock.id === user.id) {
      throw new BadRequestException("User cannot block itself.");
    }

    await this.usersService.block(user, userToBlock);
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
    const { user } = req;
    const blockedUser = await this.usersService.findOneByUsernameForUser(user, username);

    if (!blockedUser) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    if (blockedUser.id === user.id) {
      throw new BadRequestException("User cannot unblock itself.");
    }
    await this.usersService.unblock(user, blockedUser);
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
    const { user } = req;
    const userToAdd = await this.usersService.findOneByUsernameForUser(user, username);

    if (!userToAdd) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    if (userToAdd.id === user.id) {
      throw new BadRequestException("User cannot add itself as friends.");
    }
    const isBlocked = await this.usersService.isBlockedBy(userToAdd, user);
    if (isBlocked) {
      throw new BadRequestException("User cannot add a blocked user as friend.");
    }
    const isFriendsWith = await this.usersService.isFriendsWith(user, userToAdd);
    if (isFriendsWith) {
      throw new ConflictException("Friendship already exists.");
    }
    await this.usersService.addFriend(user, userToAdd);
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
    const { user } = req;
    const friendUser = await this.usersService.findOneByUsernameForUser(user, username);

    if (!friendUser) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    if (user.id === friendUser.id) {
      throw new BadRequestException("User cannot unfriend itself.");
    }
    const isFriendsWith = await this.usersService.isFriendsWith(user, friendUser);
    if (!isFriendsWith) {
      throw new ConflictException(`You're not friends with: ${username}`);
    }
    await this.usersService.removeFriend(user, friendUser);
  }
}
