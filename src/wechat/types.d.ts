export type GoodsItem = {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name: string;
  quantity: number;
  unit_price: number;
};

export type SceneInfo = {
  payer_client_ip: string;
  device_id?: string;
  store_info?: {
    id: string;
    name?: string;
    area_code?: string;
    address?: string;
  };
}

export type WechatOrderCreatePayload = {
  appid: string;
  mchid: string;
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  support_fapiao?: boolean;
  amount: {
    total: number;
    currency?: string;
  };
  payer: {
    openid: string;
  };
  detail?: {
    cost_price?: number;
    invoice_id?: string;
    goods_detail: GoodsItem[];
  };
  scene_info?: SceneInfo;
  settle_info?: {
    profit_sharing?: boolean;
  }
};

export type WechatOrderCreateRequetPayload = Pick<WechatOrderCreatePayload, 'description' | 'amount'>

export type WechatCode2SessionPayload = {
  appid: string;
  secret: string;
  js_code: string;
  grant_type: string;
};

export type WechatCode2SessionResponse = {
  session_key: string;
  unionid: string;
  errmsg: string;
  openid: string;
  errcode: number;
}

export type WXPaymentCallbackEncryptedResponse = {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: {
    original_type: string;
    algorithm: string;
    ciphertext: string;
    associated_data: string;
    nonce: string;
  }
}

export enum TRADE_TYPE {
  JSAPI = 'JSAPI',
  NATIVE = 'NATIVE',
  APP = 'APP',
  MICROPAY = 'MICROPAY',
  MWEB = 'MWEB',
  FACEPAY = 'FACEPAY',
}

export enum TRADE_STATE {
  SUCCESS = 'SUCCESS',
  REFUND = 'REFUND',
  NOTPAY = 'NOTPAY',
  CLOSED = 'CLOSED',
  REVOKED = 'REVOKED',
  USERPAYING = 'USERPAYING',
  PAYERROR = 'PAYERROR',
}

export type WXPaymentCallbackResponse = {
  appid: string;
  mchid: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: TRADE_TYPE;
  trade_state: TRADE_STATE,
  trade_state_desc: string;
  // banks https://pay.weixin.qq.com/wiki/doc/apiv3/terms_definition/chapter1_1_3.shtml#part-6
  bank_type: string;
  attach: string;
  success_time: string;
  payer: {
    openid: string;
  },
  amount: {
    total: number;
    currency: number;
    payer_total?: number;
    payer_currency?: string;
  },
  scene_info?: {
    device_id?: string;
  },
  promotion_detail?: {
    coupon_id: string;
    name?: string;
    scope?: 'GLOBAL' | 'SINGLE';
    type?: 'CASH' | 'NOCASH';
    amount: number;
    stock_id?: string;
    wechatpay_contribute?: number; // 微信出资, 单位:分,
    merchant_contribute?: number; // 商户出资
    other_contribute?: number; // 其他出资
    currency?: string;
    goods_detail?: {
      goods_id: string;
      quantity: number;
      unit_price: number;
      discount_amount: number;
      goods_remark?: string;
    }[]
  }
}