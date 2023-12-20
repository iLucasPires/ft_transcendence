import { IsAuthenticatedGuard } from "@/auth/guards/authenticated.guard";
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiProduces, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";

@Controller("files")
export class FilesController {
  @Get(":filename")
  @ApiCookieAuth("connect.sid")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "File retrieved successfully",
    type: "file",
  })
  @ApiProduces("image/png", "image/jpeg", "image/gif")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "File not found",
  })
  @UseGuards(IsAuthenticatedGuard)
  downloadFile(@Param("filename") filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: "./uploads" });
  }
}
