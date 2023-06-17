import { Test, TestingModule } from '@nestjs/testing';
import { WepayService } from './wepay.service';

describe('WepayService', () => {
  let service: WepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WepayService],
    }).compile();

    service = module.get<WepayService>(WepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
