import { Test, TestingModule } from '@nestjs/testing';
import { GptTemplateService } from './gpt-template.service';

describe('GptTemplateService', () => {
  let service: GptTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptTemplateService],
    }).compile();

    service = module.get<GptTemplateService>(GptTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
