import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { TwoFactorAuthModule } from "./2fa/2fa.module";
import { AppController } from "./app.controller";
import { AppGateway } from "./app.gateway";
import { AuthModule } from "./auth/auth.module";
import { ConnectionStatusModule } from "./connection-status/connection-status.module";
import { FilesModule } from "./files/files.module";
import { MeController } from "./me/me.controller";
import { MeModule } from "./me/me.module";
import { UsersModule } from "./users/users.module";
import { ChatModule } from "./chat/chat.module";
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';

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
    ConnectionStatusModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "frontend", "dist"),
    }),
    ChatModule,
    ChannelsModule,
    MessagesModule,
  ],
  controllers: [AppController, MeController],
  providers: [AppGateway],
})
export class AppModule {}
