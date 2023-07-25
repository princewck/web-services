import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tools } from '../models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tools]),
  ],
  controllers: [ToolsController],
  providers: [ToolsService]
})
export class ToolsModule {}
