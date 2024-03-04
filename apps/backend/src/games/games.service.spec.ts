import { Test, TestingModule } from "@nestjs/testing";
import { GamesService } from "./games.service";

describe("GameService", () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
