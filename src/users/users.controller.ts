import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Session, Request, UseGuards, Res, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientLoginDto } from './dto/login.dto';
import { confoundMobile, isPwdCorrect } from '../utils';
import { COMMON_LOGIN_ERROR, LOGIN_SMS_CODE_ERROR, USER_NOT_EXISTS } from './constants';
import { ClientAuthGuard } from '../auth/client-auth.guard';
import { Response } from 'express';
import { COOKIE_MAX_AGE_MILL_SECS } from '../constants';
import { SmsHistoryService } from '../sms-history/sms-history.service';

@Controller('users')
export class UsersController {

  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly clientsService: UsersService,
    private readonly smsHistoryService: SmsHistoryService,
  ) { }

  @Post()
  async create(@Body() body) {
    const { smsCode, type, username, mobile } = body;
    const dto = new CreateClientDto();
    dto.username = username;
    dto.mobile = mobile;
    try {
      await this.smsHistoryService.verify(mobile, type, smsCode);
      return this.clientsService.create(dto);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }

  @Post('/login')
  async login(
    @Body() loginDto: ClientLoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      await this.smsHistoryService.verify(loginDto.mobile, loginDto.type, loginDto.smsCode);
      const user = await this.clientsService.findByMobile(loginDto.mobile);
      let firstLogin = false;
      if (!user) {
        firstLogin = true;
        const user = new CreateClientDto();
        user.mobile = loginDto.mobile;
        await this.clientsService.create(user);
      }
      const { mobile } = user;
      response.cookie('mobile', confoundMobile(mobile), { maxAge: COOKIE_MAX_AGE_MILL_SECS });
      session.user = { mobile: confoundMobile(mobile) };
      await session.save();
      return {
        firstLogin,
      }
    } catch (e) {
      console.error(e);
      this.logger.error(e.message);
      session.user = null;
      response.clearCookie('username');
      throw new HttpException(e.message, 403);
    }
  }

  @Get('/logout')
  async logout(@Session() session, @Res({ passthrough: true }) res) {
    session.user = null;
    res.clearCookie('mobile');
    res.status(302).redirect('/login');
  }

  @UseGuards(ClientAuthGuard)
  @Get('/session')
  async currentUser(@Session() session: Record<string, any>) {
    console.log('session-', session);
    return session.user ?? { username: '游客' };
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
