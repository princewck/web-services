import { Test, TestingModule } from '@nestjs/testing';
import { PinyinController } from './pinyin.controller';
import { PinyinService } from './pinyin.service';

describe('PinyinController', () => {
  let controller: PinyinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinyinController],
      providers: [PinyinService],
    }).compile();

    controller = module.get<PinyinController>(PinyinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
