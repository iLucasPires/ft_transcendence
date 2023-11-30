import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@Controller("files")
export class FilesController {
  @Get(":filename")
  @ApiCookieAuth("connect.sid")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "File retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "File not found",
  })
  @UseGuards(IsAuthenticatedGuard)
  downloadFile(@Param("filename") filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: "./uploads" });
  }
}
