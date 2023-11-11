import { Module } from '@nestjs/common';
import { PinyinService } from './pinyin.service';
import { PinyinController } from './pinyin.controller';
import { PinyinUserController } from './pinyin.user.controller';
import { GptModule } from '../gpt/gpt.module';

@Module({
  controllers: [PinyinController, PinyinUserController],
  providers: [PinyinService],
  imports: [GptModule],
})
export class PinyinModule { }
