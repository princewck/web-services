/**
 * nest docs
 * https://docs.nestjs.com/first-steps
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as CookieParser from 'cookie-parser';
import { PayloadInterceptor } from './common/intercepters/payload';
import { PostStatusInterceptor } from './common/intercepters/http-status';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new PayloadInterceptor());
  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.use(CookieParser('secret'));
  app.enableCors({ origin: 'http://127.0.0.1:5173' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.NODE_ENV === 'development' ? 3006 : 3000, '0.0.0.0');
}
bootstrap();
