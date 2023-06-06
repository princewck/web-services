import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, first } from 'rxjs/operators';
import { JSAPI_CREATE_ORDER } from './constants';
import { WechatOrderCreatePayload } from './types';

@Injectable()
export class WepayService {

  private readonly logger = new Logger(WepayService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }


  async create() {
    const openId = this.getUserOpenId();
    const randomOrderId = 'wck-' + Date.now();
    const notifyURL = this.configService.get('WXPAY_NOTIFY_URL');
    const totalAmount = +Number(Math.random()).toFixed(2);
    console.log('创建订单, 金额: %d', totalAmount);
    console.log('创建订单, ID: %s', randomOrderId);
    const params: WechatOrderCreatePayload = {
      appid: this.configService.get('WX_APP_ID'),
      mchid: this.configService.get('WXPAY_MCHID'),
      description: '',
      out_trade_no: randomOrderId,
      notify_url: notifyURL,
      amount: {
        total: totalAmount,
        currency: ''
      },
      payer: {
        openid: openId,
      },
    };
    const res = await this.httpService.post<{ prepay_id: string }>(JSAPI_CREATE_ORDER, params).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data);
        throw error.response.data;
      }),
      first(),
    ).toPromise();
    this.logger.log(res.data);
    return res;
  }

  payCallback(data) {
    console.log('data', data);
    return data;
  }

  // FIXME: fix this later
  private getUserOpenId() {
    return 'open_id';
  }

}
