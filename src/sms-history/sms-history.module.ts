import { Module } from '@nestjs/common';
import { SmsHistoryService } from './sms-history.service';
import { SmsHistoryController } from './sms-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsHistory } from '../models/entities/SmsHistory';
import { AliyunModule } from '../aliyun/aliyun.module';

@Module({
  controllers: [SmsHistoryController],
  providers: [SmsHistoryService],
  imports: [TypeOrmModule.forFeature([SmsHistory]), AliyunModule]
})
export class SmsHistoryModule { }
