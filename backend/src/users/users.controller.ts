import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ListUsersDto, UpdateUserDto } from "./dto";
import { User } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto?.offset, listUsersDto?.limit);
  }

  @Get(":username")
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @Patch(":username")
  update(
    @Param("username") username: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(":username")
  remove(@Param("username") username: string): Promise<void> {
    return this.usersService.remove(username);
  }
}
