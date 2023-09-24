import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ClientStrategy } from './client.strategy';
import { ClientsModule } from '../clients/clients.module';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    UsersModule,
    passportModule,
    ClientsModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ClientStrategy],
  exports: [AuthService, passportModule],
})
export class AuthModule { }
