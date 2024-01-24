import { All, Controller, HttpException, Param, Post, Req, Request, Res, Session } from '@nestjs/common';
import { WechatOrderCreateRequetPayload } from './types';
import { WepayService } from './wechat.service';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('wechat')
export class WepayController {

  constructor(
    private readonly wepayService: WepayService,
    private readonly userService: UsersService,
  ) { }

  //https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#0
  @All('authorize/cb')
  async authorizeCallback(@Req() req, @Res({ passthrough: true }) res: Response, @Session() session) {
    console.log('authorize cb', req.query);
    const code = req.query?.code;
    const state = req.query.state;

    // 使用 code 换取 openid
    if (code && state?.includes('www.mintools.pro')) {
      const openId = await this.wepayService.getOpenIdInWechatBrowserFromCode(code);
      console.log('openid', openId);
      console.log('session.user', session.user);
      await this.userService.updateOpenId(session.user?.id, openId);
      session.user = { ...session.user, openid: openId };
      res.cookie('_registered_wx_user', 1);
      console.log('redirect url', state);
      return res.redirect(decodeURIComponent(state));
    }

    return req.query?.echostr; // 告知微信服务器, 服务器地址有效
  }

  @Post('wxpay/order')
  async createOrder(@Request() req, @Session() session) {
    // type = web | miniapp 网页和小程序使用不同的 appid
    const { description, total = 9999999, type } = req.body;
    console.log('req.body', req.body);
    const payload: WechatOrderCreateRequetPayload = {
      description,
      amount: {
        total: Math.floor(total * 100),
        currency: 'CNY'
      },
    };
    if (!session?.user?.mobile) {
      throw new HttpException('need authorization', 401);
    }
    try {
      const payment = await this.wepayService.createPayment(session.user, payload, type);
      return payment;
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }

  @Post('/wxpay/noti')
  async payCallback(@Request() req) {
    return await this.wepayService.payCallback(req.body);
  }

  @Post('session')
  login(@Request() req) {
    const { code } = req.body;
    return this.wepayService.createSession(code);
  }
}
