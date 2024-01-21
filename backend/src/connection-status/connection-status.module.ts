import { Module } from "@nestjs/common";
import { ConnectionStatusService } from "./connection-status.service";

@Module({
  providers: [ConnectionStatusService],
  exports: [ConnectionStatusService],
})
export class ConnectionStatusModule {}
