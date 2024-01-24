import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

type ConstructParams = {
  mchid?: string;
  tradeType?: string;
  tradeState?: string;
  tradeStateDesc: string;
  bankType: string;
  successTime: Date;
  total?: string;
  payerTotal?: string;
  currency?: string;
  payerCurrency?: string;
  mobile?: string;
  transactionId?: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  mchid?: string;
  tradeType?: string;
  tradeState?: string;
  tradeStateDesc: string;
  bankType: string;
  successTime: Date;
  total?: string;
  payerTotal?: string;
  currency?: string;
  payerCurrency?: string;
  mobile?: string;
  transactionId?: string;

  constructor({
    tradeType,
    tradeState,
    tradeStateDesc,
    bankType,
    successTime,
    total,
    payerTotal,
    currency,
    payerCurrency,
    // mobile,
    transactionId,
  }: ConstructParams) {
    super();
    this.tradeType = tradeType;
    this.tradeState = tradeState;
    this.tradeStateDesc = tradeStateDesc;
    this.bankType = bankType;
    this.successTime = successTime;
    this.total = total;
    this.payerTotal = payerTotal;
    this.currency = currency;
    this.payerCurrency = payerCurrency;
    // this.mobile = mobile;
    this.transactionId = transactionId;
  }
}
