import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UsersController } from "./users.controller";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FilesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
