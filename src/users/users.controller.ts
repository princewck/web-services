import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Session, Request, UseGuards, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientLoginDto } from './dto/login.dto';
import { isPwdCorrect } from '../utils';
import { COMMON_LOGIN_ERROR, USER_NOT_EXISTS } from './constants';
import { ClientAuthGuard } from '../auth/client-auth.guard';
import { Response } from 'express';
import { COOKIE_MAX_AGE_MILL_SECS } from '../constants';

@Controller('users')
export class UsersController {
  constructor(private readonly clientsService: UsersService) { }

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: ClientLoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.clientsService.findByUsername(loginDto.username);
    if (!user) {
      throw new HttpException(USER_NOT_EXISTS, 403);
    }
    const isCorrect = isPwdCorrect(loginDto.password, user.salt, user.password);
    if (isCorrect) {
      const { username, nick } = user;
      session.user = { username, nick };
      response.cookie('username', username, { maxAge: COOKIE_MAX_AGE_MILL_SECS });
      await session.save();
      return { username: user.username };
    } else {
      session.user = null;
      response.clearCookie('username');
      throw new HttpException(COMMON_LOGIN_ERROR, 400);
    }
  }

  @Get('/logout')
  async logout(@Session() session, @Res() res) {
    session.user = null;
    res.status(302).redirect('/home');
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
