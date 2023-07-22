import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException } from '@nestjs/common';
import { GptTemplateService } from './gpt-template.service';
import { CreateGptTemplateDto } from './dto/create-gpt-template.dto';
import { UpdateGptTemplateDto } from './dto/update-gpt-template.dto';
import { commonDBErrorMsg } from '../utils/errorParser';

@Controller('/admin/gpt_templates')
export class GptTemplateController {
  constructor(private readonly gptTemplateService: GptTemplateService) {}

  @Post()
  async create(@Body() createGptTemplateDto: CreateGptTemplateDto) {
    try {
      return await this.gptTemplateService.create(createGptTemplateDto);
    } catch (e) {
      throw new HttpException(commonDBErrorMsg(e.message), 400);
    }
  }

  @Get()
  findAll(@Query('page') page, @Query('pageSize') pageSize) {
    return this.gptTemplateService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gptTemplateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGptTemplateDto: UpdateGptTemplateDto) {
    return this.gptTemplateService.update(+id, updateGptTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gptTemplateService.remove(+id);
  }
}
