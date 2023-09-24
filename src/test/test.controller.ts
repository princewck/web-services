import { Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { AliyunService } from '../aliyun/aliyun.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly aliyun: AliyunService,
  ) {}

  @Post('/sms/single')
  public async sendSMS() {
    return await this.aliyun.sendSMS('18521560570');
  }
}
