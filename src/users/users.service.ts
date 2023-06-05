import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models';

export type IUser = any;

@Injectable()
export class UsersService {
  private readonly users: IUser[];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
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
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }
}
