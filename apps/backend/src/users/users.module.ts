import { FilesModule } from "@/files/files.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ConnectionStatusModule } from "@/connection-status/connection-status.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FilesModule,
    ConnectionStatusModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
