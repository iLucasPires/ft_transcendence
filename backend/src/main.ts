import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
      exposedHeaders: ["set-cookie"],
    },
  });

  app.set("trust proxy", true);
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

  const config = new DocumentBuilder()
    .setTitle("42 Transcedence")
    .setDescription("The 42 Transcendence Pong API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
