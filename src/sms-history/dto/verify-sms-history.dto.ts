import { IsIn, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { CountryCode } from 'libphonenumber-js'; 
import { SMS_TYPE } from "../../models/entities/SmsHistory";

export class VerifySmsHistoryDto {

  @IsIn(['login', 'validate'], { message: '消息类型不正确' })
  type: SMS_TYPE;

  @IsPhoneNumber('CN')
  mobile: string;

  @IsNotEmpty()
  smsCode?: string;

  verifyCode?: string;

}
