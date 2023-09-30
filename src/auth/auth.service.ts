import { HttpException, Injectable } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../models';
import { REGISTER_ERROR_USERNAME_EXISTS } from '../users/constants';
import { promisify } from 'util';
import { randomBytes } from 'node:crypto';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { encryptPwd, isPwdCorrect } from '../utils';
import { AdminRole } from '../models/admin.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly adminService: AdminsService,
    private readonly jwtService: JwtService
  ) {
    this.adminService.findByUsername('wangchengkai').then(wck => {
      if (!wck) {
        const dto = new CreateAdminDto();
        dto.username = 'wangchengkai';
        dto.password = '12345';
        dto.role = AdminRole.ADMIN;
        this.createAdmin(dto).then(res => {
          console.log('creat user res', res);
        });
      }
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    console.log('userame', username, password)
    const user: Admin = await this.adminService.findByUsername(username);
    console.log('user', user);
    console.log('correct', isPwdCorrect(password, user.salt, user.password));
    console.log('password', password);
    if (user && isPwdCorrect(password, user.salt, user.password)) {
      const { password, salt, mobile, ...result } = user;
      console.log('user ', result);
      return result;
    }
    return null;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const exists = await this.adminService.findByUsername(createAdminDto.username);
    if (exists) {
      throw new HttpException({ message: REGISTER_ERROR_USERNAME_EXISTS }, 400);
    }
    const salt = (await promisify(randomBytes)(10)).toString('hex');
    createAdminDto.salt = salt;
    createAdminDto.password = encryptPwd(createAdminDto.password, salt);
    const result = await this.adminService.create(createAdminDto);
    return result;
  }

  async login(user: any): Promise<{ access_token: any }> {
    const userInfo: Admin = await this.adminService.findByUsername(user.username);
    const { username, nick, mobile, role } = userInfo;
    const payload = { username, nick, mobile, role, isAdmin: role === AdminRole.ADMIN };
    console.log('userpayload', payload);
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

}
