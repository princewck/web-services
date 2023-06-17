import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Rsa } from '../utils/rsa';
import { JSAPI_CREATE_ORDER, JSCODE_TO_SESSION } from './constants';
import { WechatCode2SessionPayload, WechatCode2SessionResponse, WechatOrderCreatePayload, WechatOrderCreateRequetPayload, WXPaymentCallbackEncryptedResponse, WXPaymentCallbackResponse } from './types';
import { createDecipheriv } from 'crypto';

@Injectable()
export class WepayService {

  private readonly logger = new Logger(WepayService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }


  async createPayment(payload: WechatOrderCreateRequetPayload, openid: string) {
    // FIX: remove open id params
    const openId = openid || this.getUserOpenId();
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
    const { prepay_id } = res.data;
    return await this.getPaySignature(prepay_id);
  }

  // 微信支付成功回调
  payCallback(data: WXPaymentCallbackEncryptedResponse): WXPaymentCallbackResponse {
    if (!data || !data.resource) throw new Error('invalid callback data');
    //https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_5.shtml
    const { resource: { ciphertext, nonce, associated_data, algorithm } } = data;
    const key = this.configService.get('WXPAY_APIV3_SECRET');

    // decryption refer to https://github.com/klover2/wechatpay-node-v3-ts/blob/master/index.ts
    const AUTH_KEY_LENGTH = 16;
    const keyBytes = Buffer.from(key, 'utf-8');
    const nonceBytes = Buffer.from(nonce, 'utf-8');
    const associatedDataBytes = Buffer.from(associated_data, 'utf-8');
    const ciphertextBytes = Buffer.from(ciphertext, 'base64');
    const cipherDataLength = ciphertextBytes.length - AUTH_KEY_LENGTH;
    const cipherDataBytes = ciphertextBytes.slice(0, cipherDataLength);
    const authTagBytes = ciphertextBytes.slice(cipherDataLength);
    const decipher = createDecipheriv('aes-256-gcm', keyBytes, nonceBytes);
    decipher.setAuthTag(authTagBytes);
    decipher.setAutoPadding();
    decipher.setAAD(Buffer.from(associatedDataBytes));
    const outputText = Buffer.concat([
      decipher.update(cipherDataBytes),
      decipher.final(),
    ]).toString('utf-8');
    let result: WXPaymentCallbackResponse;
    try {
      result = JSON.parse(outputText);
    } catch (e) {
      throw new HttpException({
        code: 'FAIL',
        message: '失败',
      }, 403);
    }
    console.log(result);
    return result;
  }

  // use client-side code to login, get open_id and session_key
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
    return this.commonSignWithArrayValue(struct);
  }

  private getPaySignature(prepayId: string) {
    const appid = this.configService.get('WX_APP_ID');
    const timeStamp = Math.floor(Date.now() / 1000) + '';
    const nonceStr = this.getNonceStr();
    const pkg = `prepay_id=${prepayId}`;
    const signType = 'RSA';
    const paySign = this.commonSignWithArrayValue([
      appid, timeStamp, nonceStr, pkg,
    ]);
    return {
      timeStamp,
      nonceStr,
      package: pkg,
      signType,
      paySign
    }
  }

  private getAuthorization(method: string, URL: string, body: any) {
    const authType = 'WECHATPAY2-SHA256-RSA2048';
    const mchid = this.configService.get('WXPAY_MCHID');
    const serialNo = this.configService.get('WXPAY_SERIAL_NO');
    const timestamp = Math.floor(Date.now() / 1000);
    const nonceStr = this.getNonceStr();
    const signature = this.wepaySign(method, timestamp, nonceStr, URL, body);
    console.log('signature', signature);
    return authType + ' ' + [`mchid="${mchid}"`, `serial_no="${serialNo}"`, `timestamp="${timestamp}"`, `nonce_str="${nonceStr}"`, `signature="${signature}"`].join(',');
  }


  private getNonceStr() {
    return Math.floor(Math.random() * 10000) + '';
  }

  private commonSignWithArrayValue(values: string[]) {
    const structStr = values.map(item => item + '\n').join('');
    const cert = this.configService.get('WXPAY_APICLIENT_CERT');
    return Rsa.sign(structStr, cert);
  }
}
