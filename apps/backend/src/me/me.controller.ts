import { TwoFactorAuthGuard } from "@/auth/guards/2fa.guard";
import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import { ChannelsService } from "@/channels/channels.service";
import { FindUserDto, ListUsersDto, UpdateUserDto } from "@/users/dto";
import { UserEntity } from "@/users/user.entity";
import { UsersService } from "@/users/users.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { diskStorage } from "multer";
import { UserSessionDto } from "./dto/user-session.dto";
import { ChannelEntity } from "@/channels/channel.entity";

@Controller("me")
@ApiCookieAuth("connect.sid")
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService,
  ) {}

  @Get()
  @UseGuards(IsAuthenticatedGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
    type: UserSessionDto,
  })
  getMe(@Req() req: Request): UserSessionDto {
    return req.user;
  }

  @Patch()
  @UseGuards(TwoFactorAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Username already exists",
  })
  updateMe(@Req() req: Request, @Body() body: UpdateUserDto): Promise<UserEntity> {
    return this.usersService.update(req.user, body);
  }

  @Post("avatar")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TwoFactorAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, `${randomStringGenerator()}.${file.originalname.split(".").pop().toLowerCase()}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new UnprocessableEntityException("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Avatar updated successfully",
    type: UserEntity,
  })
  updateAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(req.user, file);
  }

  @Get("blocked")
  @UseGuards(TwoFactorAuthGuard)
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
    description: "A list of blocked users.",
    type: [FindUserDto],
  })
  findBlockedUsers(@Req() req: Request, @Query() listUsersDto: ListUsersDto): Promise<FindUserDto[]> {
    return this.usersService.findBlockedUsers(req.user, listUsersDto);
  }

  @Get("friends")
  @UseGuards(TwoFactorAuthGuard)
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
    description: "A list of users friends.",
    type: [FindUserDto],
  })
  findFriends(@Req() req: Request, @Query() listUsersDto: ListUsersDto): Promise<FindUserDto[]> {
    return this.usersService.findFriends(req.user, listUsersDto);
  }

  @Get("channels")
  @UseGuards(TwoFactorAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "A list of user channels.",
    type: [ChannelEntity],
  })
  findChannels(@Req() req: Request): Promise<ChannelEntity[]> {
    return this.channelsService.findUserChannels(req.user);
  }
}
