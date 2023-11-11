import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from './common/middlewares/logger';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WepayController } from './wechat/wechat.controller';
import { WepayModule } from './wechat/wechat.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import configuration from './config';

import { GptModule } from './gpt/gpt.module';
import { GptTemplateModule } from './gpt-template/gpt-template.module';
import { ToolCategoryModule } from './tool-category/tool-category.module';
import { ToolsModule } from './tools/tools.module';
import { UsersModule } from './users/users.module';
import { AliyunService } from './aliyun/aliyun.service';
import { TestModule } from './test/test.module';
import { isDev } from './utils';
import { AliyunController } from './aliyun/aliyun.controller';
import { SmsHistoryModule } from './sms-history/sms-history.module';
import { PinyinModule } from './pinyin/pinyin.module';

console.log('isDev', isDev);

@Module({
  imports: [
    AuthModule, AdminsModule,
    WepayModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GlobalModule,
    GptModule,
    GptTemplateModule,
    ToolCategoryModule,
    ToolsModule,
    UsersModule,
    ...(isDev ? [TestModule] : []),
    SmsHistoryModule,
    PinyinModule,
  ],
  controllers: [AppController, WepayController, AliyunController],
  providers: [AppService, AliyunService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })
  }

}
