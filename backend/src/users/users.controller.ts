import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, ListUsersDto } from "./dto";
import { User } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto);
  }

  @Get(":username")
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOne(username);
  }

  @Delete(":username")
  remove(@Param("username") username: string): Promise<void> {
    return this.usersService.remove(username);
  }
}
