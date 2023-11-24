import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.set("trust proxy", true)
  app.setGlobalPrefix("api", {
    exclude: ["/", "health"],
  });

  const config = new DocumentBuilder()
    .setTitle("42 Transcedence")
    .setDescription("The 42 Transcendence Pong API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  await app.listen(3000);
}
bootstrap();
