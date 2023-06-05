import { Controller, Post, Request } from '@nestjs/common';
import { WepayService } from './wepay.service';

@Controller('wepay')
export class WepayController {

  constructor(
    private readonly wepayService: WepayService
  ) {}

  @Post('order')
  createOrder(@Request() req) {
    return this.wepayService.create();
  }
}
