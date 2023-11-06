import { Body, Controller, Get, HttpException, Post, Query, Req, Session, UseGuards } from '@nestjs/common';
import { AliyunService } from './aliyun.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Buffer } from 'buffer';

@Controller('')
export class AliyunController {

  constructor(private readonly aliyunService: AliyunService) { }

  @UseGuards(JwtAuthGuard)
  @Post('ali/sts')
  async sts() {
    return this.aliyunService.createReadonlySTS();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/ali/sts/upload')
  async getPupSTS(@Req() request) {
    try {
      console.log('filename', request.body.filename);
      return await this.aliyunService.createPutSTS(request.body.filename);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/ali/oss/objects')
  async listOSSObjects(@Query() query) {
    return this.aliyunService.listOSSObject();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/ali/oss/imgs')
  async listOSSImages(@Query() query) {
    return this.aliyunService.listOSSImages();
  }

  @UseGuards(JwtAuthGuard)
  @Post('oss/upload')
  async upload(@Req() request) {
    const { filename, data }: { data: string, filename: string } = request.body;
    const file = Buffer.from(data, 'utf8');
    return await this.aliyunService.putOSSObject(filename, file);
  }

  @Post('api/imageseg')
  async imageSegment(@Body() body) {
    const { image } = body;
    if (!image) throw new HttpException({ message: 'invalid image' }, 403);
    const res = await this.aliyunService.segmentBody(image);
    return res;
  }

}
