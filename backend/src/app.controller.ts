import { Controller, Get, Redirect } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @Redirect("/api/docs")
  getDocs() {}

  @Get("/health")
  getHealth() {
    return "OK";
  }
}
