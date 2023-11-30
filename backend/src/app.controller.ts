import { Controller, Get, Redirect } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  @Redirect("/api/docs")
  getDocs() {}

  @Get("/health")
  getHealth() {
    return "OK";
  }
}
