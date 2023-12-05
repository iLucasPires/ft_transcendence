import { Module } from "@nestjs/common";
import { FilesModule } from "src/files/files.module";
import { UsersModule } from "src/users/users.module";
import { MeController } from "./me.controller";

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [MeController],
})
export class MeModule {}
