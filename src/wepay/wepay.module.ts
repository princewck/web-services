import { Module } from '@nestjs/common';
import { WepayController } from './wepay.controller';
import { WepayService } from './wepay.service';

@Module({
  providers: [WepayService],
  controllers: [ WepayController ],
  exports: [WepayService],
})
export class WepayModule {

  
}
