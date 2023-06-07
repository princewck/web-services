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

export type WechatOrderCreateRequetPayload = Pick<WechatOrderCreatePayload, 'description' | 'out_trade_no' | 'amount'>

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