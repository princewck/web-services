import { Test, TestingModule } from '@nestjs/testing';
import { SmsHistoryController } from './sms-history.controller';
import { SmsHistoryService } from './sms-history.service';

describe('SmsHistoryController', () => {
  let controller: SmsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsHistoryController],
      providers: [SmsHistoryService],
    }).compile();

    controller = module.get<SmsHistoryController>(SmsHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
