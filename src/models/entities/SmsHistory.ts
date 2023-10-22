import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum SMS_TYPE {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGET = 'forget',
  VALIDATE = 'validate'
}

@Entity("sms_history", { schema: "web_service" })
export class SmsHistory {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("varchar", { name: 'sms_code', length: 255 })
  public smsCode: string | null;

  @Column('varchar', { name: 'verify_code' })
  public verifyCode: string | null;

  @Column("varchar", { name: "mobile", length: 255 })
  public mobile: string;

  @Column("varchar", { name: "type", nullable: true, length: 10 })
  public type: SMS_TYPE | null;

  @Column("datetime", {
    name: "update_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  public updateAt: Date | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  public createdAt: Date | null;

  @Column("datetime", {
    name: "deleted_at",
    nullable: true,
    default: () => null,
  })
  public deletedAt: Date | null;
}
