import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToolCategoryService } from './tool-category.service';
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';

@Controller('/admin/tool/categories')
export class ToolCategoryController {
  constructor(private readonly toolCategoryService: ToolCategoryService) {}

  @Post()
  create(@Body() createToolCategoryDto: CreateToolCategoryDto) {
    return this.toolCategoryService.create(createToolCategoryDto);
  }

  @Get()
  findAll() {
    return this.toolCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolCategoryDto: UpdateToolCategoryDto) {
    return this.toolCategoryService.update(+id, updateToolCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolCategoryService.remove(+id);
  }
}
