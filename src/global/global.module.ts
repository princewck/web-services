import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

/** 全局使用的模块 */
@Global()
@Module({
  imports: [HttpModule],
  exports: [HttpModule]
})
export class GlobalModule {}
