import { IsIn, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { CountryCode } from 'libphonenumber-js';
import { SMS_TYPE } from "../../models/entities/SmsHistory";

export class CreateSmsHistoryDto {

  @IsIn([SMS_TYPE.LOGIN, SMS_TYPE.REGISTER, SMS_TYPE.FORGET], { message: '消息类型不正确' })
  type: SMS_TYPE;

  @IsPhoneNumber('CN')
  mobile: string;

  smsCode?: string;

  verifyCode?: string;

}
