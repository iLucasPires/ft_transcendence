import { UsersService } from "@/users/users.service";
import { Controller, Get, HttpStatus, NotFoundException, Param } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { FindGameDto } from "./dto";
import { GamesService } from "./games.service";

@Controller("games")
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
  ) {}

  @Get(":username")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Games retrieved successfully",
    type: [FindGameDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async findGamesByUsername(@Param("username") username: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }
    return await this.gamesService.findUserGames(user.id);
  }
}
