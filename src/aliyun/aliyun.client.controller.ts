import { Body, Controller, Get, HttpException, Post, Query, Req, Session, UseGuards } from '@nestjs/common';
import { AliyunService } from './aliyun.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Buffer } from 'buffer';

@Controller('')
export class AliyunClientController {

  constructor(private readonly aliyunService: AliyunService) { }

  @Post('ali/sts')
  async sts() {
    return this.aliyunService.createReadonlySTS();
  }

  @Post('ali/sts/upload')
  async getPupSTS(@Req() request) {
    try {
      console.log('filename', request.body.filename);
      return await this.aliyunService.createPutSTS(request.body.filename);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Post('oss/upload')
  async upload(@Req() request) {
    const { filename, data }: { data: string, filename: string } = request.body;
    const file = Buffer.from(data, 'utf8');
    return await this.aliyunService.putOSSObject(filename, file);
  }

  @Post('api/imageseg')
  async imageSegment(@Body() body) {
    const { image, type, hd = false } = body;
    if (!image) throw new HttpException({ message: 'invalid image' }, 403);
    if (!['body', 'common'].includes(type)) throw new HttpException({ message: 'invalid type' }, 403);
    if (type === 'body') return await this.aliyunService.segmentBody(image, hd);
    if (type === 'common') return await this.aliyunService.segmentCommon(image, hd);
  }

}
