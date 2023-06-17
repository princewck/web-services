import { All, Controller, Param, Post, Request } from '@nestjs/common';
import { WechatOrderCreateRequetPayload } from './types';
import { WepayService } from './wechat.service';

@Controller('wechat')
export class WepayController {

  constructor(
    private readonly wepayService: WepayService
  ) { }

  @Post('wxpay/order')
  createOrder(@Request() req) {
    // FIXME: openid should be removed later
    const { description, out_trade_no = Date.now().toString(), total = 9999999, openid } = req.body;
    console.log('req.body', req.body);
    const payload: WechatOrderCreateRequetPayload = {
      description,
      out_trade_no,
      amount: {
        total: Math.floor(total * 100),
        currency: 'CNY'
      },
    };
    return this.wepayService.createPayment(payload, openid);
  }

  @Post('wxpay/callback')
  payCallback(@Request() req) {
    return this.wepayService.payCallback(req.body);
  }

  @Post('session')
  login(@Request() req) {
    const { code } = req.body;
    return this.wepayService.createSession(code);
  }
}
