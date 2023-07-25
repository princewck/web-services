import { Test, TestingModule } from '@nestjs/testing';
import { ToolCategoryController } from './tool-category.controller';
import { ToolCategoryService } from './tool-category.service';

describe('ToolCategoryController', () => {
  let controller: ToolCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolCategoryController],
      providers: [ToolCategoryService],
    }).compile();

    controller = module.get<ToolCategoryController>(ToolCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
