import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Rsa } from '../utils/rsa';
import { GET_ACCESS_TOKEN, GET_AUTH_ACCESS_TOKEN, JSAPI_CREATE_ORDER, JSCODE_TO_SESSION, wxApiwithParams } from './constants';
import { WechatCode2SessionPayload, WechatCode2SessionResponse, WechatOrderCreatePayload, WechatOrderCreateRequetPayload, WXPaymentCallbackEncryptedResponse, WXPaymentCallbackResponse } from './types';
import { createDecipheriv } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { OrderService } from '../order/order.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { UpdateOrderDto } from '../order/dto/update-order.dto';
import { md5 } from '../utils';
import dayjs = require('dayjs');

export type APPIDType = 'web' | 'miniapp';

@Injectable()
export class WepayService {

  private readonly logger = new Logger(WepayService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getAccessToken(mobile: string) {
    if (!mobile) {
      throw new Error('get user info failed');
    }
    const appId = this.configService.get('WX_APP_ID_WEB');
    const secret = this.configService.get('WX_APP_SECRET_WEB');
    const apiUrl = wxApiwithParams(GET_ACCESS_TOKEN, appId, secret);
    const cacheKey = `WEB_ACCESS_TOKEN:${mobile}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('cached token', cached);
      return cached;
    }
    const token = await axios.get(apiUrl).then(async (res: any) => {
      console.log('axios res', res.data);
      const { access_token, expires_in, errcode } = res.data ?? {};
      if (errcode === 40164) {
        return Promise.reject(new Error('当前服务 IP 不在公众号的白名单中'));
      }
      await this.cacheManager.set(cacheKey, access_token, { ttl: expires_in * .8 });
      return access_token;
    });
    console.log('token', token);
    return token;
  }

  // 微信浏览器里获取用户 openId
  async getOpenIdInWechatBrowserFromCode(code: string) {
    try {
      const appId = this.configService.get('WX_APP_ID_WEB');
      const secret = this.configService.get('WX_APP_SECRET_WEB');
      const url = wxApiwithParams(GET_AUTH_ACCESS_TOKEN, appId, secret, code);
      const response = await axios.get(url).then(res => res.data);
      console.log(response, 'openId', 'access_token=', response.access_token);
      return response.openid;
    } catch (e) {
      throw new Error(e);
    }
  }


  async createPayment(user: any, payload: WechatOrderCreateRequetPayload, type?: 'web' | 'miniapp') {
    // FIX: remove open id params
    // const openId = await this.getUserOpenId(user, type);
    const createdAt = new Date();
    const dateStr = dayjs(createdAt).format('YYYYMMDDHHmmss');
    // 订单号: MT- 日期 - 用户身份字符 - 四位随机数
    const randomOrderId = 'MT-' + dateStr + md5(user.mobile + 1)?.slice(0, 5) + (Math.floor(Math.random() * 1000) + 1000);
    const notifyURL = this.configService.get('WXPAY_NOTIFY_URL');
    const totalAmount = +Number(Math.random()).toFixed(2);
    this.logger.log('创建订单, 金额: %d', totalAmount);
    this.logger.log('创建订单, ID: %s', randomOrderId);
    const appId = this.configService.get(type === 'web' ? 'WX_APP_ID_WEB' : 'WX_APP_ID');
    const params: WechatOrderCreatePayload = Object.assign({
      appid: appId,
      mchid: this.configService.get('WXPAY_MCHID'),
      description: '',
      out_trade_no: randomOrderId,
      notify_url: notifyURL,
      amount: {
        total: totalAmount,
        currency: ''
      },
      payer: {
        openid: user.openid,
      },
    }, payload);
    console.log('create with openid ', user.openid);
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
    const signature = await this.getPaySignature(prepay_id, appId);
    const order = new CreateOrderDto({
      total: totalAmount,
      createdAt,
      mchid: '',
      appid: appId,
      outTradeNo: randomOrderId,
      payerOpenId: user.openid,
      mobile: user.mobile,
    });
    const orderCreated = await this.orderService.create(order);
    return {
      orderCreated,
      signature,
    };
  }

  // 微信支付成功回调
  async payCallback(data: WXPaymentCallbackEncryptedResponse): Promise<WXPaymentCallbackResponse> {
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
    console.log('支付成功回调:', result);
    const { mchid, appid, out_trade_no, transaction_id, trade_type, trade_state, trade_state_desc, bank_type, attach, success_time, payer: { openid }, amount: {
      total, // 单位为分
      payer_total,
      currency,
      payer_currency,
    } } = result;
    const update = new UpdateOrderDto({
      mchid,
      transactionId: transaction_id,
      tradeType: trade_type,
      tradeState: trade_state,
      tradeStateDesc: trade_state_desc,
      bankType: bank_type,
      successTime: new Date(success_time),
      total: Number(total / 100).toFixed(2),
      payerTotal: Number(payer_total / 100).toFixed(2) ?? '0',
      currency,
      payerCurrency: payer_currency,
    });
    try {
      await this.orderService.updateByNO(out_trade_no, update);
    } catch (e) {
      console.error(e);
      throw new HttpException('订单回执信息更新失败', 400);
    }
    return result;
  }

  // use client-side code to login, get open_id and session_key
  // 暂时只支持了小程序, app secret 是小程序的
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

  private wepaySign(method: string, timestamp: string | number, nonceStr: string, url: string, body: any) {
    const urlInfo = new URL(url);
    const _url = urlInfo.pathname + urlInfo.search; // 踩坑
    const struct: any = [method, _url, timestamp, nonceStr];
    if (['PUT', 'POST'].includes(method) && body) {
      struct.push(JSON.stringify(body));
    }
    return this.commonSignWithArrayValue(struct);
  }

  private getPaySignature(prepayId: string, appId: string) {
    const timeStamp = Math.floor(Date.now() / 1000) + '';
    const nonceStr = this.getNonceStr();
    const pkg = `prepay_id=${prepayId}`;
    const signType = 'RSA';
    const paySign = this.commonSignWithArrayValue([
      appId, timeStamp, nonceStr, pkg,
    ]);
    return {
      appId,
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
