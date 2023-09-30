import { Controller, Get, UseGuards, Post, Request, Header, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
export class AdminsController {
  constructor(
    private readonly usersService: AdminsService,
  ) { }

}
