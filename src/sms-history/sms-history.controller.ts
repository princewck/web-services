import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { SmsHistoryService } from './sms-history.service';
import { VerifySmsHistoryDto } from './dto/verify-sms-history.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSmsHistoryDto } from './dto/create-sms-history.dto';

@Controller('')
export class SmsHistoryController {
  constructor(
    private readonly smsHistoryService: SmsHistoryService,
  ) { }

  /** 发送消息 */
  @Post('/sms')
  async sendSMS(@Body() createSmsHistoryDto: CreateSmsHistoryDto) {
    const { mobile, type } = createSmsHistoryDto;
    return await this.smsHistoryService.send(mobile, type);
  }

  // @Post('admin/sms/verify')
  // async verify(@Body() verifySmsHistoryDto: VerifySmsHistoryDto) {
  //   const { mobile, type, smsCode } = verifySmsHistoryDto;
  //   try {
  //     return await this.smsHistoryService.verify(mobile, type, smsCode);
  //   } catch (e) {
  //     if (e instanceof HttpException) throw e;
  //     throw new HttpException(e.message, 400);
  //   }
  // }

}
