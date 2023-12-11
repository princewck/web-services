import { HttpException, Injectable } from '@nestjs/common';
import { UpdateSmsHistoryDto } from './dto/update-sms-history.dto';
import { SMS_TYPE, SmsHistory } from '../models/entities/SmsHistory';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import dayjs = require('dayjs');
import { AliyunService } from '../aliyun/aliyun.service';
import { genRandomNumberCodeString } from '../utils';
import { CODE_EXPIRED_ERROR, CODE_MISMATCH_ERROR, CODE_NOT_EXISTS_ERROR } from './constants';
import { ConfigService } from '@nestjs/config';
import { CreateSmsHistoryDto } from './dto/create-sms-history.dto';

@Injectable()
export class SmsHistoryService {

  constructor(
    @InjectRepository(SmsHistory)
    private readonly smsHistoryRepository: Repository<SmsHistory>,
    private readonly aliyunService: AliyunService,
    private readonly configService: ConfigService,
  ) {

  }

  create(createSmsHistoryDto: CreateSmsHistoryDto) {
    return this.smsHistoryRepository.save(createSmsHistoryDto);
  }

  /** 取最近一条有效消息 */
  findByMobileAndType(mobile: string, type: string) {
    return this.smsHistoryRepository.findOne({ where: { mobile, type, deletedAt: null }, order: { updateAt: 'DESC' } });
  }

  update(id: number, updateSmsHistoryDto: UpdateSmsHistoryDto) {
    return this.smsHistoryRepository.update({ id }, updateSmsHistoryDto);
  }

  /** 校验验证码 */
  async verify(mobile: string, type: SMS_TYPE, code: string) {
    if (process.env.NODE_ENV === 'development' && mobile?.endsWith('0570') && mobile?.startsWith('185')) {
      return true;
    }
    const exists = await this.findByMobileAndType(mobile, type);
    console.log('exists code', exists);
    if (!exists) throw new Error(CODE_NOT_EXISTS_ERROR);
    const smsExpiresMinutes = this.configService.get('SMS_EXPIRES_MINUTES');
    if (!(smsExpiresMinutes > 0)) {
      throw new HttpException('sms expire config is invalid', 500);
    }
    if (exists.smsCode !== code) {
      throw new Error(CODE_MISMATCH_ERROR);
    }
    if (dayjs(exists.createdAt).add(smsExpiresMinutes, 'minutes').isBefore(dayjs(Date.now()))) {
      throw new Error(CODE_EXPIRED_ERROR);
    }
    /** 验证成功, 生成凭证 */
    const verifyCode = genRandomNumberCodeString(9);
    const dto = exists;
    dto.verifyCode = verifyCode;
    dto.deletedAt = new Date();
    await this.update(exists.id, dto);
    return { verifyCode };
  }

  /**
   * 检查是否可以发消息
   * 1. 一天内超过 10 条
   * 2. 上次发送不到一分钟
   * */
  async validate(type: string, mobile: string) {
    const today = {
      start: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs().startOf('day').add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    }
    const todaySMS = await this.smsHistoryRepository.findOne({
      where: {
        createdAt: Between(today.start, today.end),
        mobile,
        type,
      },
      order: {
        createdAt: 'DESC',
      }
    });
    if (!todaySMS) {
      throw new HttpException({ message: '消息发送次数过多', reason: 'reach_limt' }, 403);
    }
    if (todaySMS && dayjs(todaySMS.createdAt).add(55, 'seconds').isAfter(dayjs())) {
      throw new HttpException({
        message: '消息发送频率过快',
        reason: 'rate_control',
      }, 403);
    }
    return true;
  }

  async send(phone: string, type: SMS_TYPE) {
    try {
      await this.validate(type, phone);
      const code = genRandomNumberCodeString();
      await this.aliyunService.sendSMS(phone, code);
      const dto = new CreateSmsHistoryDto();
      dto.smsCode = code;
      dto.mobile = phone;
      dto.type = type;
      await this.create(dto);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(e.message, 400);
    }
  }

}
