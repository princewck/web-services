import { Test, TestingModule } from '@nestjs/testing';
import { GptTemplateController } from './gpt-template.controller';
import { GptTemplateService } from './gpt-template.service';

describe('GptTemplateController', () => {
  let controller: GptTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptTemplateController],
      providers: [GptTemplateService],
    }).compile();

    controller = module.get<GptTemplateController>(GptTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
