import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

import { LoggerMiddleware } from './common/middlewares/logger';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WepayController } from './wepay/wepay.controller';
import { WepayModule } from './wepay/wepay.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import configuration from './config';


@Module({
  imports: [
    AuthModule, UsersModule,
    WepayModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GlobalModule,
  ],
  controllers: [AppController, WepayController],
  providers: [AppService, UsersService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })
  }

}
