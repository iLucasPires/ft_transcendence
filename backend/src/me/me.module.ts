import { FilesModule } from "@/files/files.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [MeController],
})
export class MeModule {}
