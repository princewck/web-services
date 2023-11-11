import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PinyinService } from './pinyin.service';
import { CreatePinyinDto } from './dto/create-pinyin.dto';
import { UpdatePinyinDto } from './dto/update-pinyin.dto';

@Controller('admin/pinyin')
export class PinyinController {
  constructor(private readonly pinyinService: PinyinService) {}


  @Get()
  async getPinyin() {

  }
  
}
