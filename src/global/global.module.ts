import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AliyunService } from '../aliyun/aliyun.service';

/** 全局使用的模块 */
@Global()
@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 3600 * 24 }
    }),
    AliyunService,
  ],
  exports: [HttpModule, JwtModule, AliyunService],
  providers: [AliyunService]
})
export class GlobalModule { }
