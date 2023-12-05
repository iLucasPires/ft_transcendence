import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ListUsersDto } from "./dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(IsAuthenticatedGuard)
  findAll(@Query() listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto?.offset, listUsersDto?.limit);
  }

  @Get(":username")
  @UseGuards(IsAuthenticatedGuard)
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }
}
