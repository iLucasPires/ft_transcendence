import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileEntity } from "./file.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const fileEntity = this.fileRepository.create({
      path: `/api/files/${file.filename}`,
    });

    return this.fileRepository.save(fileEntity);
  }
}
