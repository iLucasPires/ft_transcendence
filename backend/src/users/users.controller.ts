import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ListUsersDto } from "./dto";
import { User } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto);
  }

  @Get(":username")
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @Delete(":username")
  remove(@Param("username") username: string): Promise<void> {
    return this.usersService.remove(username);
  }
}
