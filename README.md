# 这是一个什么项目
- 封装各种 web 应用的基础能力, 即插即用

# 规划中的功能
- 微信支持
- 支付宝支付
- 微信登陆
- 小程序第三方开发
- ...

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Dev
### 如何调试微信 API
使用 [NPS](https://ehang-io.github.io/nps/#/use?id=%e9%85%8d%e7%bd%ae%e6%96%87%e4%bb%b6%e8%af%b4%e6%98%8e) 进行内网穿透, 将微信支持等依赖域名和 Https 的接口代理到穿透的访问点, 实现服务器接口直接代理到本地 server 的能力

- 安装教程: 省略
- 准备
阿里云安全组开放以下端口
8080, 8081, 8024
- 配置如下

```
# npc.conf
appname = nps
#Boot mode(dev|pro)
runmode = dev

#HTTP(S) proxy port, no startup if empty
http_proxy_ip=0.0.0.0
http_proxy_port=8081
#https_proxy_port=443
#https_just_proxy=false
#default https certificate setting
#https_default_cert_file=conf/server.pem
#https_default_key_file=conf/server.key

##bridge
bridge_type=tcp
bridge_port=8024
bridge_ip=0.0.0.0

```
- 启动服务器 nps
```docker rm nps
docker run  --name nps --net=host -v /root/nps_conf:/conf ffdfgdfg/nps
```
> 直接用 /root/start_nps.sh

- 启动客户端 npc
```
# vkey 是 nps 管理后台 (http://www.mintools.pro:8080) 添加的 客户端
./npc -server 139.224.190.109:8024 -vkey=zg4bjfjzrin696pl

```

- 添加代理
在 TCP 隧道模块添加代理
服务端端口: 外网端口, 比如 8004, 则访问 www.mintools.pro:8001
目标: 客户端的本地 IP:PORT, 如本地启动的服务为 127.0.0.1:3006

- nginx 的对应配置
```nginx
upstream npsgateway {
  server 127.0.0.1:8004;
}

server {
  server_name www.mintools.pro;
  listen 443;

  # 此处省略

  location ^~/api/pay {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_buffering off;
    rewrite ^/api/pay/(.*)$ /$1 break;
    proxy_pass http://npsgateway;
  }
}
```
- 使用上述配置后, 访问  https://www.mintools.pro/api/pay/xxx 时, 实际访问的是 localhost:3006/xxx
- 这样我们可以用上述 entrypoint 作为微信的回调地址, 调用本地服务, 实现快速调试

**注意**: 使用完成后及时关闭内网穿透隧道, 防止安全问题


## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
