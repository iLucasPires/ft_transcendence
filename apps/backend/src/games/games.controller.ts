import { TwoFactorAuthGuard } from "@/auth/guards/2fa.guard";
import { UsersService } from "@/users/users.service";
import { Controller, Get, HttpStatus, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiResponse } from "@nestjs/swagger";
import { FindGameDto } from "./dto";
import { GamesService } from "./games.service";

@Controller("games")
@UseGuards(TwoFactorAuthGuard)
@ApiCookieAuth("connect.sid")
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
