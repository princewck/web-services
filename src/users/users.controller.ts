import { Controller, Get, UseGuards, Post, Request, Header } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getProdile(@Request() req) {
    return this.usersService.findAll();
  }

}
