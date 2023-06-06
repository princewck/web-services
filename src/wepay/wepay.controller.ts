import { All, Controller, Param, Post, Request } from '@nestjs/common';
import { WepayService } from './wepay.service';

@Controller('wechat')
export class WepayController {

  constructor(
    private readonly wepayService: WepayService
  ) {}

  @Post('wxpay/order')
  createOrder(@Request() req) {
    return this.wepayService.create();
  }

  @All('wxpay/pay')
  payCallback(@Request() req) {
    return this.wepayService.payCallback(req);
  }

  @Post('session')
  login(@Param() params) {
    console.log('params', params);
    return params;
  }
}
