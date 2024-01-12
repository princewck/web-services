import { Module } from '@nestjs/common';
import { AliyunController } from './aliyun.controller';
import { AliyunClientController } from './aliyun.client.controller';
import { AliyunService } from './aliyun.service';

@Module({
  controllers: [AliyunController, AliyunClientController],
  providers: [AliyunService],
  exports: [AliyunService],
})
export class AliyunModule {}
