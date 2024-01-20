import { Module } from '@nestjs/common';
import { WepayController } from './wechat.controller';
import { WepayService } from './wechat.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [WepayService],
  controllers: [ WepayController ],
  exports: [WepayService],
})
export class WepayModule {

}
