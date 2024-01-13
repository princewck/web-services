import { Module } from '@nestjs/common';
import { AliyunController } from './aliyun.controller';
import { AliyunClientController } from './aliyun.client.controller';
import { AliyunService } from './aliyun.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [AliyunController, AliyunClientController],
  providers: [AliyunService],
  exports: [AliyunService],
})
export class AliyunModule {}
