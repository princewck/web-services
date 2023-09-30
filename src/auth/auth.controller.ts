import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
