import { CallHandler, ExecutionContext, Injectable, HttpStatus, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class PostStatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    return next.handle().pipe(
      map(value => {
        console.log(res.statusCode, value, req.method);
        if (req.method === 'POST') {
          if (res.statusCode === HttpStatus.CREATED && value) {
            res.status(HttpStatus.OK);
          }
        }
        return value;
      }),
    );
  }
}