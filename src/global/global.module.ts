import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AliyunModule } from '../aliyun/aliyun.module';
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
    AliyunModule,
  ],
  exports: [HttpModule, JwtModule, AliyunModule],
  providers: [AliyunService]
})
export class GlobalModule { }
