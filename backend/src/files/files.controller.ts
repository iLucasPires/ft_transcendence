import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { FilesService } from "./files.service";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ApiCookieAuth("connect.sid")
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
    status: HttpStatus.CREATED,
    description: "File uploaded successfully",
  })
  @UseGuards(IsAuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadFile(file);
  }

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
