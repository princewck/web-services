import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  providers: [GptService],
  controllers: [GptController],
  exports: [GptService],
})
export class GptModule {
  



}
