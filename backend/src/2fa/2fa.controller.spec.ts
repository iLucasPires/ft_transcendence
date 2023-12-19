import { Test, TestingModule } from "@nestjs/testing";
import { TwoFactorAuthController } from "./2fa.controller";

describe("TwoFactorAuthontroller", () => {
  let controller: TwoFactorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorAuthController],
    }).compile();

    controller = module.get<TwoFactorAuthController>(TwoFactorAuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
