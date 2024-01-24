import { Module } from '@nestjs/common';
import { WepayController } from './wechat.controller';
import { WepayService } from './wechat.service';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [UsersModule, OrderModule],
  providers: [WepayService],
  controllers: [ WepayController ],
  exports: [WepayService],
})
export class WepayModule {

}
