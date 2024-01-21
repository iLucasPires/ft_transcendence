import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwoFactorAuthModule } from "./2fa/2fa.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { MeController } from "./me/me.controller";
import { MeModule } from "./me/me.module";
import { UsersModule } from "./users/users.module";
import { AppGateway } from "./app.gateway";
import { ConnectionStatusService } from './connection-status/connection-status.service';

const OrmModule = TypeOrmModule.forRootAsync({
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
});

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === "production",
    }),
    OrmModule,
    UsersModule,
    AuthModule,
    FilesModule,
    MeModule,
    TwoFactorAuthModule,
  ],
  controllers: [AppController, MeController],
  providers: [AppGateway, ConnectionStatusService],
})
export class AppModule {}
