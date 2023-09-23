import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../models';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
    TypeOrmModule.forFeature([Clients]),
  ]
})
export class ClientsModule { }
