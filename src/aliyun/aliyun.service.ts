import { HttpException, Injectable, Logger } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import { ConfigService } from '@nestjs/config';
import { isDev } from '../utils';
import { SEND_SMD_FAILED } from './constants';

@Injectable()
export class AliyunService {

  private readonly logger = new Logger(AliyunService.name);

  constructor(
    private readonly configService: ConfigService,
  ) { }

  private createSMSClient(): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      accessKeyId: this.configService.get('ALI_ACCESS_KEY_ID'),
      accessKeySecret: this.configService.get('ALI_ACCESS_KEY_SECRET'),
    });
    return new Dysmsapi20170525(config);
  }

  async sendSMS(phoneNumber: string) {
    const client = this.createSMSClient();
    const options = new $Dysmsapi20170525.SendSmsRequest({
      signName: '闵诺网络',
      templateCode: 'SMS_287610622',
      phoneNumbers: phoneNumber,
      templateParam: JSON.stringify({ code: '12345' })
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      const { body: res } = await client.sendSmsWithOptions(options, runtime);
      if (res?.code?.toLocaleLowerCase() !== 'ok') {
        this.logger.error(res);
        throw new HttpException(isDev ? res.message : SEND_SMD_FAILED, 400);
      }
    } catch (e) {
      throw new HttpException(isDev ? e.message : SEND_SMD_FAILED, 400);
    }
  }
}
