import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'hospitals',
})
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  branch_name: string;

  @Column()
  address: string;

  @Column()
  summary: string;

  @Column()
  telephone: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  city: string;

  @Column()
  region: string;

  @Column()
  avg_rating: number;

  @Column()
  hours: string;

  @Column()
  avg_price: number;

  @Column()
  comment_total: number;

  @Column()
  photo_url: string;

  @Column()
  stages: number;

  @Column()
  is_insurance: boolean;

  @Column()
  doctor_total: number;

  @Column()
  coupon_total:  number;

  @Column()
  created: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

}
