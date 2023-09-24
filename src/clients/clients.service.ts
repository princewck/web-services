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
export class ClientsService {

  constructor(
    @InjectRepository(Clients) private readonly usersRepository: Repository<Clients>,
    // private readonly jwtService: JwtService
  ) { }

  async create(createClientDto: CreateClientDto) {
    const exists = await this.findByUsername(createClientDto.username);
    console.log('exists', exists);
    if (exists) {
      throw new HttpException({ message: REGISTER_ERROR_USERNAME_EXISTS }, 400);
    }
    const salt = (await promisify(randomBytes)(10)).toString('hex');
    createClientDto.salt = salt;
    createClientDto.password = encryptPwd(createClientDto.password, salt);
    const result = await this.usersRepository.save(createClientDto);
    return result;
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return this.usersRepository.find({ id });
  }

  findByUsername(username: string) {
    return this.usersRepository.findOne({ username });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
