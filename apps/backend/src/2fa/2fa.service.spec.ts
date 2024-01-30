import { Test, TestingModule } from "@nestjs/testing";
import { TwoFactorAuthervice } from "./2fa.service";

describe("TwoFactorAuthervice", () => {
  let service: TwoFactorAuthervice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorAuthervice],
    }).compile();

    service = module.get<TwoFactorAuthervice>(TwoFactorAuthervice);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
