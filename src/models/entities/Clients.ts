import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users", { schema: "web_service" })
export class Clients {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("varchar", { name: "username", length: 255 })
  public username: string;

  @Column("varchar", { name: "nick", length: 255 })
  public nick: string;

  @Column("varchar", { name: "open_id", length: 255 })
  public openId: string;

  @Column("text", { name: "password" })
  public password: string;

  @Column("varchar", { name: "salt", length: 255 })
  public salt: string;

  @Column("varchar", { name: "mobile", length: 255 })
  public mobile: string;

  @Column("date", { name: "created_at" })
  public createdAt: string;

  @Column("date", { name: "updated_at" })
  public updatedAt: string;

  // 用户余额, 虚拟币, 不允许小数点
  @Column('bigint', { name: 'balance' })
  public balance: number;
}
