import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

import { LoggerMiddleware } from './common/middlewares/logger';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WepayController } from './wepay/wepay.controller';
import { WepayService } from './wepay/wepay.service';
import { WepayModule } from './wepay/wepay.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config';
import { existsSync } from 'fs';
import { resolve } from 'path';

const configFileExists = existsSync(resolve(__dirname, './config.js'));


@Module({
  imports: [
    AuthModule, UsersModule,
    WepayModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({ isGlobal: true, load: configFileExists ? configuration : undefined }),
    WepayModule
  ],
  controllers: [AppController, WepayController],
  providers: [AppService, UsersService, WepayService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })
  }

}
