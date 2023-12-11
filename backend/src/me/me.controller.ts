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
  UseInterceptors
} from "@nestjs/common";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { diskStorage } from "multer";
import { IsAuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { ListUsersDto, UpdateUserDto } from "../users/dto";
import { UserEntity } from "../users/user.entity";
import { UsersService } from "../users/users.service";

@Controller("me")
@ApiCookieAuth("connect.sid")
@UseGuards(IsAuthenticatedGuard)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
    type: UserEntity,
  })
  getMe(@Req() req: Request): UserEntity {
    return req.user as UserEntity;
  }

  @Patch()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
    type: UserEntity,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Username already exists",
  })
  updateMe(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(req.user as UserEntity, body);
  }

  @Post("avatar")
  @HttpCode(HttpStatus.OK)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Avatar updated successfully",
    type: UserEntity,
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(
            null,
            `${randomStringGenerator()}.${file.originalname
              .split(".")
              .pop()
              .toLowerCase()}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new UnprocessableEntityException("Only image files are allowed!"),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
    }),
  )
  updateAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(req.user as UserEntity, file);
  }

  @Get("blocked")
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
    type: [UserEntity],
  })
  findBlockedUsers(
    @Req() req: Request,
    @Query() listUsersDto: ListUsersDto,
  ): Promise<UserEntity[]> {
    return this.usersService.findBlockedUsers(
      req.user as UserEntity,
      listUsersDto,
    );
  }
}
