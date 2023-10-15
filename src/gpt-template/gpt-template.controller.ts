import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, UseGuards } from '@nestjs/common';
import { GptTemplateService } from './gpt-template.service';
import { CreateGptTemplateDto } from './dto/create-gpt-template.dto';
import { UpdateGptTemplateDto } from './dto/update-gpt-template.dto';
import { commonDBErrorMsg } from '../utils/errorParser';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/admin/gpt_templates')
export class GptTemplateController {
  constructor(private readonly gptTemplateService: GptTemplateService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGptTemplateDto: CreateGptTemplateDto) {
    try {
      return await this.gptTemplateService.create(createGptTemplateDto);
    } catch (e) {
      throw new HttpException(commonDBErrorMsg(e.message), 400);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page, @Query('pageSize') pageSize) {
    return this.gptTemplateService.findAll(page, pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gptTemplateService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGptTemplateDto: UpdateGptTemplateDto) {
    return this.gptTemplateService.update(+id, updateGptTemplateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gptTemplateService.remove(+id);
  }
}
