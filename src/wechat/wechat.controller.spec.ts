import { Test, TestingModule } from '@nestjs/testing';
import { WepayController } from './wechat.controller';

describe('Wepay Controller', () => {
  let controller: WepayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WepayController],
    }).compile();

    controller = module.get<WepayController>(WepayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
