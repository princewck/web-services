import { All, Controller, Param, Post, Request } from '@nestjs/common';
import { WechatOrderCreateRequetPayload } from './types';
import { WepayService } from './wepay.service';

@Controller('wechat')
export class WepayController {

  constructor(
    private readonly wepayService: WepayService
  ) { }

  @Post('wxpay/order')
  createOrder(@Request() req) {
    const { description, out_trade_no = Date.now().toString(), total = 9999999 } = req.body;
    console.log('req.body', req.body);
    const payload: WechatOrderCreateRequetPayload = {
      description,
      out_trade_no,
      amount: {
        total: Math.floor(total * 100),
        currency: 'CNY'
      },
    };
    return this.wepayService.create(payload);
  }

  @All('wxpay/pay')
  payCallback(@Request() req) {
    return this.wepayService.payCallback(req);
  }

  @Post('session')
  login(@Request() req) {
    const { code } = req.body;
    return this.wepayService.createSession(code);
  }
}
