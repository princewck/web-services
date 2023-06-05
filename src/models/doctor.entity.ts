import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'doctors',
})
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: number;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  mobile: string;

  @Column()
  job: string;

  @Column()
  introduce: string;

  @Column()
  avatar: string;

  @Column()
  avg_score: string;

  @Column()
  reply_total: number;

  @Column()
  fans_total: number;

  @Column()
  good_total: number;

  @Column()
  link: string;

  @Column()
  hospital_id: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

}
