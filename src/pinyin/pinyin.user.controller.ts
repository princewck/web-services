import { Controller, Get, Query } from '@nestjs/common';
import { PinyinService } from './pinyin.service';
// import { CreatePinyinDto } from './dto/create-pinyin.dto';
// import { UpdatePinyinDto } from './dto/update-pinyin.dto';

@Controller('api/pinyin')
export class PinyinUserController {
  constructor(private readonly pinyinService: PinyinService) {}


  @Get()
  async getPinyin(@Query('words') words, @Query('tune') tune) {
    return await this.pinyinService.getPinyin(words, tune);
  }
  
}
