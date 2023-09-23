import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    UsersModule,
    passportModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, passportModule],
})
export class AuthModule {}
