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
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new PayloadInterceptor());
  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.use(CookieParser('secret', { }));
  app.use(session({
    secret: 'mintools',
    resave: true,
    saveUninitialized: true,
    name: '_mtools_session',
    cookie: {
      secure: false,
      httpOnly: true,
    }
  }))
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.NODE_ENV === 'development' ? 3006 : 3000, '0.0.0.0');
}
bootstrap();
