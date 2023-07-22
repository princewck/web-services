import { Module } from '@nestjs/common';
import { GptTemplateService } from './gpt-template.service';
import { GptTemplateController } from './gpt-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptTemplates } from '../models';

@Module({
  imports: [
    TypeOrmModule.forFeature([GptTemplates]),
  ],
  controllers: [GptTemplateController],
  providers: [GptTemplateService]
})
export class GptTemplateModule {}
