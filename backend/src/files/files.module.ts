import { Module, UnprocessableEntityException } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FilesController } from "./files.controller";
import { diskStorage } from "multer";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { FilesService } from "./files.service";
import { FileEntity } from "./file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

const storage = diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      `${randomStringGenerator()}.${file.originalname
        .split(".")
        .pop()
        .toLowerCase()}`,
    );
  },
});

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({
      storage,
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new UnprocessableEntityException("Only image files are allowed!"),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
