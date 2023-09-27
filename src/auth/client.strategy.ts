import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { ClientsService } from '../clients/clients.service';

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'client') {

    constructor() {
      console.log('new client strategy');
      super();
    }
  

  async validate(@Session() session: Record<string, any>): Promise<any> {
    console.log('session==', session);
    if (!session.user) {
      // throw new UnauthorizedException('请登录');
      return false;
    }
    // return session.user;
    return true;
  }
}
