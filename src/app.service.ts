import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // return 'Hello World!';
    throw new HttpException({ code: 1001, message: '没有此服务' }, 403);
  }
}
