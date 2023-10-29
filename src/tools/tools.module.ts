import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tools } from '../models';
import { ToolsUserController } from './tools.user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tools]),
  ],
  controllers: [ToolsController, ToolsUserController],
  providers: [ToolsService]
})
export class ToolsModule {}
