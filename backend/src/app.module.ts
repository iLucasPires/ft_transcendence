import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { MeController } from "./me/me.controller";
import { MeModule } from "./me/me.module";
import { TwoFactorAuthModule } from "./2fa/2fa.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === "production",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        database: configService.get("DB_NAME"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        synchronize: configService.get("NODE_ENV") !== "production",
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    MeModule,
    TwoFactorAuthModule,
  ],
  controllers: [AppController, MeController],
})
export class AppModule {}
