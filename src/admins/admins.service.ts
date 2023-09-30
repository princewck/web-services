import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../models';
import { CreateAdminDto } from 'src/auth/dto/createAdmin.dto';

export type IUser = any;

@Injectable()
export class AdminsService {
  private readonly users: IUser[];

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  async findAll(): Promise<IUser[]> {
    return this.adminRepository.find();
  }

  async findByUsername(username: string): Promise<IUser | undefined> {
    return this.adminRepository.findOne({ where: { username } });
  }

  async create(createAdminDto: CreateAdminDto) {
    return this.adminRepository.save(createAdminDto);
  }
}
