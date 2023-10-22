import { IsIn, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { SMS_TYPE } from "../../models/entities/SmsHistory";

export class ClientLoginDto {
  // @IsNotEmpty()
  // public username: string;

  @IsPhoneNumber('CN', { message: '请输入正确的手机号' })
  public mobile: string;

  @IsNotEmpty({ message: '请输入手机验证码' })
  public smsCode: string;

  @IsIn([SMS_TYPE.LOGIN])
  public type: SMS_TYPE;
  // @IsString()
  // public password: string;

}
