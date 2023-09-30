import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class ClientAuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('validate session data', request?.session);
    return !!request?.session?.user;
  }

};
