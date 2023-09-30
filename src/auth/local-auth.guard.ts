import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express-serve-static-core';
import { Admin } from '../models';
import { COMMON_PARAMS_ERROR } from '../users/constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

  handleRequest<TUser = Admin>(err: any, user: any, info: any, context: any, status?: any): TUser {
    const request: Request = context.switchToHttp().getRequest();
    const { username, password } = request.body;
    if (err || !user) {
      if (!username || !password) {
        throw new HttpException(COMMON_PARAMS_ERROR, 400);
      } else {
        throw err ?? new BadRequestException();
      }
    }
    return user;
  }

};
