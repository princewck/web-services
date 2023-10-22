import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class ClientAuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request?.session?.user) {
      return request?.session?.user;
    } else {
      throw new HttpException('鉴权失败', 401);
    }
    // return !!request?.session?.user;
  }

};
