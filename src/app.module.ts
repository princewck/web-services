import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from './common/middlewares/logger';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ScheduleModule } from '@nestjs/schedule';

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
import { TestModule } from './test/test.module';
import { isDev } from './utils';
import { SmsHistoryModule } from './sms-history/sms-history.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PinyinModule } from './pinyin/pinyin.module';
import { TasksModule } from './tasks/tasks.module';
import * as redisStore from 'cache-manager-redis-store';
import { AliyunModule } from './aliyun/aliyun.module';
import { JobModule } from './jobs/job.module';

console.log('isDev', redisStore);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule, AdminsModule,
    WepayModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register<any>({
      isGlobal: true,
      store: redisStore,
      host: '139.224.190.109',
      port: '6379',
      // url: 'redis://139.224.190.109:6379',
      password: 'm2sywngSaCk%>s+',
      ttl: 60,
    }),
    GlobalModule,
    JobModule,
    GptModule,
    GptTemplateModule,
    ToolCategoryModule,
    ToolsModule,
    UsersModule,
    ...(isDev ? [TestModule] : []),
    SmsHistoryModule,
    PinyinModule,
    TasksModule,
    AliyunModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })
  }

}
