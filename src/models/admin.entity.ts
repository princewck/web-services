import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum AdminRole {
  MEMBER = 'member',
  MASTER = 'master',
  ADMIN = 'admin'
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  nick: string;

  @Column()
  open_id: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  @Column()
  mobile: string;

  @Column()
  role: AdminRole
}
