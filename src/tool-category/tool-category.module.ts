import { Module } from '@nestjs/common';
import { ToolCategoryService } from './tool-category.service';
import { ToolCategoryController } from './tool-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolCategories } from '../models';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToolCategories]),
  ],
  controllers: [ToolCategoryController],
  providers: [ToolCategoryService]
})
export class ToolCategoryModule {}
