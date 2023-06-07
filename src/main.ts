/**
 * nest docs
 * https://docs.nestjs.com/first-steps
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as CookieParser from 'cookie-parser';
import { PayloadInterceptor } from './common/intercepters/payload';
import { PostStatusInterceptor } from './common/intercepters/http-status';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new PayloadInterceptor());
  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.use(CookieParser('secret'));
  await app.listen(3006);
}
bootstrap();
