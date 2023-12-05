import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { Repository } from "typeorm";
import { FileEntity } from "./file.entity";

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

  findFile(path: string): Promise<FileEntity> {
    return this.fileRepository.findOneBy({ path });
  }

  async deleteFile(file: FileEntity): Promise<void> {
    const filepath = `./uploads/${file.path.split("/").pop()}`;

    await this.fileRepository.delete(file);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
