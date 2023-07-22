import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginateList } from '../../utils/PaginateList';

@Injectable()
export class PayloadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next
      .handle()
      .pipe(
        map((value) => {
          if (res.statusCode !== 200) {
            return {
              data: value,
              message: 'failed',
            };
          }
          if (value instanceof PaginateList) {
            return {
              page: Number(value.page),
              total: Number(value.total),
              items: value.items,
              pageSize: Number(value.pageSize),
            };
          }
          return value;
        }),
      );
  }
}
