import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ListUsersDto } from "./dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { ApiCookieAuth, ApiQuery, ApiResponse } from "@nestjs/swagger";

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
    type: [User],
  })
  @UseGuards(IsAuthenticatedGuard)
  findAll(@Query() listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto?.offset, listUsersDto?.limit);
  }

  @Get(":username")
  @ApiCookieAuth("connect.sid")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User retrieved successfully",
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  @UseGuards(IsAuthenticatedGuard)
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }
}
