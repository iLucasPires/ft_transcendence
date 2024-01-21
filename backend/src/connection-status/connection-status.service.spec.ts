import { Test, TestingModule } from "@nestjs/testing";
import { ConnectionStatusService } from "./connection-status.service";

describe("ConnectionStatusService", () => {
  let service: ConnectionStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionStatusService],
    }).compile();

    service = module.get<ConnectionStatusService>(ConnectionStatusService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
