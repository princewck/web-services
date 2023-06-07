import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { firstValueFrom } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Rsa, RSA2 } from '../utils/rsa';
import { JSAPI_CREATE_ORDER, JSCODE_TO_SESSION } from './constants';
import { WechatCode2SessionPayload, WechatCode2SessionResponse, WechatOrderCreatePayload, WechatOrderCreateRequetPayload } from './types';

@Injectable()
export class WepayService {

  private readonly logger = new Logger(WepayService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }


  async create(payload: WechatOrderCreateRequetPayload) {
    const openId = this.getUserOpenId();
    const randomOrderId = 'wck-' + Date.now();
    const notifyURL = this.configService.get('WXPAY_NOTIFY_URL');
    const totalAmount = +Number(Math.random()).toFixed(2);
    this.logger.log('创建订单, 金额: %d', totalAmount);
    this.logger.log('创建订单, ID: %s', randomOrderId);
    const params: WechatOrderCreatePayload = Object.assign({
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
    }, payload);
    const authorization = this.getAuthorization('POST', JSAPI_CREATE_ORDER, params);
    const res = await firstValueFrom(this.httpService.post<{ prepay_id: string }>(JSAPI_CREATE_ORDER, params, {
      headers: {
        Authorization: authorization,
      },
    }).pipe(
      catchError((error: AxiosError) => {
        throw error.response.data;
      }),
      first(),
    ));
    this.logger.log(res.data, res.status, res.statusText);
    return res.data;
  }

  payCallback(data) {
    return data;
  }

  async createSession(code: string) {
    const params: WechatCode2SessionPayload = {
      appid: this.configService.get('WX_APP_ID'),
      secret: this.configService.get('WX_APP_SECRET'),
      js_code: code,
      grant_type: 'authorization_code', // 固定值
    };
    const res = await firstValueFrom(this.httpService.get<WechatCode2SessionResponse>(JSCODE_TO_SESSION, { params }).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data);
        throw error.response.data;
      }),
      first(),
    ));
    return res.data;
  }

  // FIXME: fix this later
  private getUserOpenId() {
    return this.configService.get('MOCK_OPENID');
  }

  private wepaySign(method: string, timestamp: string | number, nonceStr: string, url: string, body: any) {
    const urlInfo = new URL(url);
    const _url = urlInfo.pathname + urlInfo.search; // 踩坑
    const struct: any = [method, _url, timestamp, nonceStr];
    if (['PUT', 'POST'].includes(method) && body) {
      struct.push(JSON.stringify(body));
    }
    const structStr = struct.map(item => item + '\n').join('');
    const cert = this.configService.get('WXPAY_APICLIENT_CERT');
    const encrypted = Rsa.sign(structStr, cert);
    return encrypted;
  }

  private getAuthorization(method: string, URL: string, body: any) {
    const authType = 'WECHATPAY2-SHA256-RSA2048';
    const mchid = this.configService.get('WXPAY_MCHID');
    const serialNo = this.configService.get('WXPAY_SERIAL_NO');
    const timestamp = Math.floor(Date.now() / 1000);
    const nonceStr = Math.floor(Math.random() * 10000) + '';
    const signature = this.wepaySign(method, timestamp, nonceStr, URL, body);
    console.log('signature', signature);
    return authType + ' ' + [`mchid="${mchid}"`, `serial_no="${serialNo}"`, `timestamp="${timestamp}"`, `nonce_str="${nonceStr}"`, `signature="${signature}"`].join(',');
  }

}
