import { IsNumber, IsPhoneNumber } from "class-validator";

export class CreateOrderDto {
  public mchid: string;
  public appid: string;
  public outTradeNo: string;
  public payerOpenId: string;
  public createdAt: Date;

  constructor({
    mchid,
    appid,
    outTradeNo,
    payerOpenId,
    createdAt,
    total,
    mobile,
  }) {
    this.mchid = mchid;
    this.appid = appid;
    this.outTradeNo = outTradeNo;
    this.payerOpenId = payerOpenId;
    this.createdAt = createdAt;
    this.total = total;
    this.mobile = mobile;
  }

  @IsNumber()
  public total: string;

  @IsPhoneNumber('CN')
  public mobile?: string;


}
