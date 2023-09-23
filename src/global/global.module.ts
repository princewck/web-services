import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

/** 全局使用的模块 */
@Global()
@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 3600 * 24 }
    })
  ],
  exports: [HttpModule, JwtModule]
})
export class GlobalModule { }
