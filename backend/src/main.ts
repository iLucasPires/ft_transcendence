import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as expressSession from "express-session";
import * as passport from "passport";
import { AppModule } from "./app.module";
import { SessionAdapter } from "./auth/session.adapter";

function addSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle("42 Transcedence")
    .setDescription("The 42 Transcendence Pong API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/api/docs", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
      exposedHeaders: ["set-cookie"],
    },
  });
  const configService = app.get(ConfigService);
  const isProductionEnv = configService.get("NODE_ENV") === "production";
  const sessionMiddleware = expressSession({
    secret: configService.get("SESSIONS_SECRET"),
    resave: false,
    saveUninitialized: false,
    proxy: isProductionEnv,
    cookie: {
      sameSite: isProductionEnv ? "strict" : false,
      secure: isProductionEnv,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    },
  });

  app.set("trust proxy", isProductionEnv);
  app.setGlobalPrefix("api", { exclude: ["health"] });
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(sessionMiddleware);
  app.use(passport.session());
  app.useWebSocketAdapter(new SessionAdapter(app, sessionMiddleware));

  addSwagger(app);

  await app.listen(3000);
}
bootstrap();
