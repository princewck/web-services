// 通用
/** https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml */
export const JSAPI_CREATE_ORDER = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';

// 公众号
/** https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html */
export const GET_ACCESS_TOKEN = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$APPID&secret=$APPSECRET';

// 这个 access token 是用来获取 open id 的 
// https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#0
export const GET_AUTH_ACCESS_TOKEN = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=$APPID&secret=$SECRET&code=$CODE&grant_type=authorization_code';


// 小程序
/** https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html */
export const JSCODE_TO_SESSION = 'https://api.weixin.qq.com/sns/jscode2session';



export function wxApiwithParams(api: string, ...params) {
  const reg = /\=(\$\w+)([^\w]|$)/g;
  let matchResut = reg.exec(api ?? '');
  const args = params.slice();
  let result = api;
  while (matchResut?.length > 2) {
    const key = matchResut[1];
    if (key) {
      const value = args.shift();
      result = result.replace(key, value);
    }
    matchResut = reg.exec(api ?? '');
  }
  return result;
}