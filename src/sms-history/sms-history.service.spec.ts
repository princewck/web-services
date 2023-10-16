import { Test, TestingModule } from '@nestjs/testing';
import { SmsHistoryService } from './sms-history.service';

describe('SmsHistoryService', () => {
  let service: SmsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsHistoryService],
    }).compile();

    service = module.get<SmsHistoryService>(SmsHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
