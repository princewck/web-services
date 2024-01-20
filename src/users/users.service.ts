import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from '../models';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import { promisify } from 'util';
// import { JwtService } from '@nestjs/jwt';
import { encryptPwd } from '../utils';
import { REGISTER_ERROR_USERNAME_EXISTS } from './constants';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Clients) private readonly usersRepository: Repository<Clients>,
    // private readonly jwtService: JwtService
  ) { }

  async create(createClientDto: CreateClientDto) {
    const exists = await this.findByMobile(createClientDto.mobile);
    if (exists) {
      throw new HttpException({ message: REGISTER_ERROR_USERNAME_EXISTS }, 400);
    }
    // 暂时不支持密码登录
    if (createClientDto.password) {
      const salt = (await promisify(randomBytes)(10)).toString('hex');
      createClientDto.salt = salt;
      createClientDto.password = encryptPwd(createClientDto.password, salt);
    }
    const result = await this.usersRepository.save(createClientDto);
    return result;
  }

  async updateOpenId(id: number, openId: string = '') {
    try {
      if (openId) {
        await this.usersRepository.update({ id }, { openId });
      }
    } catch (e: any) {
      console.error('设置 openid 失败', id, openId);
      throw e;
    }
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return this.usersRepository.find({ id });
  }

  findByMobile(mobile: string) {
    return this.usersRepository.findOne({ mobile });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
