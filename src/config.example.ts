export default () => ({
  MASTER_NODE: true, // 分布式部署, 只能有一个 master, 处理定时任务等工作
  NODE_NAME: 'master', // 用于分发请求, 请使用不一样的名字, 多个实例用一样名字会出错
  MOCK_OPENID: 'xxxxxxxxxx', // 测试用, 不是必须
  WXPAY_MCHID: '1538509741',
  WXPAY_APIV3_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // 32 位
  WXPAY_APICLIENT_CERT: 'YOUR SECRET',
  WX_APP_ID: 'xxxxxxxx',
  WX_APP_ID_WEB: 'xxxxxxxx',
  WX_APP_SECRET: 'xxxxxxx',
  OPENAI_API_KEY: 'OPENAI_API_KEY',
  ALI_TEXT_GEN_API_KEY: 'XXXXXXX', // 灵柩大模型 API key 
  BAIDU_LLM_CLIENT_ID: 'xxxx', // 百度千帆大模型 https://console.bce.baidu.com/tools/?_=1699797018399&u=bce-head#/api?product=AI&project=%E5%8D%83%E5%B8%86%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0&parent=ERNIE-Bot-4&api=rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro&method=post
  BAIDU_LLM_CLIENT_SECRET: 'xxxx',
  OSS_EXPIRE_MINUTES: 1,
});

