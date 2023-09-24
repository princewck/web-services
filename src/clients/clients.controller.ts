import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Session, Request } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientLoginDto } from './dto/login.dto';
import { isPwdCorrect } from '../utils';
import { USER_NOT_EXISTS } from './constants';

@Controller('users')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: ClientLoginDto,
    @Session() session: Record<string, any>,
    @Request() req
  ) {
    const user = await this.clientsService.findByUsername(loginDto.username);
    console.log('user', user);
    if (!user) {
      throw new HttpException(USER_NOT_EXISTS, 403);
    }
    const isCorrect = isPwdCorrect(loginDto.username, user.salt, user.password);
    console.log('session', req.session.user);
    if (isCorrect) {
      const { username, nick } = user;
      req.session.user = { username, nick };
      await session.save();
    }
    return { username: user.username };
  }

  @Get('/session')
  async currentUser(@Session() session: Record<string, any>) {
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
