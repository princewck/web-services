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
import * as createMySQLStore from 'express-mysql-session';
import { ConfigService } from '@nestjs/config';
import { COOKIE_MAX_AGE_MILL_SECS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new PayloadInterceptor());
  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.use(CookieParser('secret', {}));

  const configService = app.get(ConfigService);
  const options = {
    host: configService.get('MYSQL_DB_HOST'),
    port: 3306,
    user: configService.get('MYSQL_DB_USER'),
    password: configService.get('MYSQL_DB_PWD'),
    database: configService.get('MYSQL_DB_DATABASE')
  };
  const MySQLStore = createMySQLStore(session);
  const sessionStore = new MySQLStore(options);

  // Optionally use onReady() to get a promise that resolves when store is ready.
  sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
  }).catch(error => {
    // Something went wrong.
    console.error(error);
  });

  app.use(session({
    secret: 'mintools',
    resave: true,
    saveUninitialized: true,
    name: '_mtools_session',
    cookie: {
      secure: false,
      httpOnly: true,
      signed: true,
      maxAge: COOKIE_MAX_AGE_MILL_SECS,
    },
    store: sessionStore,
  }))
  app.enableCors({ origin: true });
  /** whitelist: true 时会过滤掉没有定义的字段 */
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
  await app.listen(process.env.NODE_ENV === 'development' ? 3006 : 3000, '0.0.0.0');
}
bootstrap();
