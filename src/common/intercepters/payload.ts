import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PayloadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next
      .handle()
      .pipe(
        map((value) => {
          if (res.status == 200) {
            return {
              data: value,
              message: 'failed',
            };
          }
          return value;
        }),
      );
  }
}
