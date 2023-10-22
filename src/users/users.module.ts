import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../models';
import { SmsHistoryModule } from '../sms-history/sms-history.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([Clients]),
    SmsHistoryModule,
  ]
})
export class UsersModule { }
