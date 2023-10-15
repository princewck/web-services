import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { COMMON_LOGIN_ERROR } from '../users/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /** 
   * passport-local 约定的参数
   * 掉坑提示: 当 body 中缺少约定的字段时, 这个方法不会触发
   * https://stackoverflow.com/questions/68171886/nestjs-passport-local-strategy-validate-method-never-called
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException({ message: COMMON_LOGIN_ERROR }, 403);
    }
    return user;
  }
}
