import { Controller, Get, HttpException, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AliyunService } from './aliyun.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Buffer } from 'buffer';

@Controller('ali')
export class AliyunController {

  constructor(private readonly aliyunService: AliyunService) { }


  @UseGuards(JwtAuthGuard)
  @Post('sts')
  async sts() {
    return this.aliyunService.createReadonlySTS();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sts/upload')
  async getPupSTS(@Req() request) {
    try {
      return await this.aliyunService.createPutSTS(request.body.filename);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('oss/upload')
  async upload(@Req() request) {
    const { filename, data }: { data: string, filename: string } = request.body;
    const file = Buffer.from(data, 'utf8');
    return await this.aliyunService.putOSSObject(filename, file);
  }

}
