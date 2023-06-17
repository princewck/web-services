import { Module } from '@nestjs/common';
import { WepayController } from './wechat.controller';
import { WepayService } from './wechat.service';

@Module({
  providers: [WepayService],
  controllers: [ WepayController ],
  exports: [WepayService],
})
export class WepayModule {

  
}
