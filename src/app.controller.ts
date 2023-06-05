import { Controller, Get, UseGuards, Post, Request, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProdile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard())
  @Get('list')
  getList(@Request() req) {
    return [
      {
        name: '王程凯',
      },
      {
        name: '李颖'
      }
    ];
  }

}
