import { Controller, Get, UseGuards, Post, Request, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
// import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProdile(@Request() req) {
    return req.user;
  }

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
