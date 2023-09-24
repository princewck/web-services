import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { ClientsService } from '../clients/clients.service';

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(@Session() session: Record<string, any>): Promise<any> {
    if (!session.user) {
      throw new UnauthorizedException();
    }
    return session.user;
  }
}
