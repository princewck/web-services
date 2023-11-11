import { Test, TestingModule } from '@nestjs/testing';
import { PinyinService } from './pinyin.service';

describe('PinyinService', () => {
  let service: PinyinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinyinService],
    }).compile();

    service = module.get<PinyinService>(PinyinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
