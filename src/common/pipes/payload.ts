import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class PayloadPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    return {
      data: value,
      success: true,
    };
  }
}
