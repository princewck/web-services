import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders", { schema: "web_service" })
export class Orders {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  public id: string;

  @Column("varchar", { name: "mchid", nullable: true, length: 255 })
  public mchid: string | null;

  @Column("varchar", { name: "appid", length: 255 })
  public appid: string;

  @Column("varchar", { name: "out_trade_no", length: 255 })
  public outTradeNo: string;

  @Column("varchar", { name: "trade_type", nullable: true, length: 128 })
  public tradeType: string | null;

  @Column("varchar", { name: "trade_state", nullable: true, length: 128 })
  public tradeState: string | null;

  @Column("varchar", {
    name: "trade_state_desc",
    nullable: true,
    length: 128,
  })
  public tradeStateDesc: string | null;

  @Column("varchar", { name: "bank_type", nullable: true, length: 128 })
  public bankType: string | null;

  @Column("text", { name: "attach", nullable: true })
  public attach: string | null;

  @Column("datetime", { name: "success_time", nullable: true })
  public successTime: Date | null;

  @Column("varchar", { name: "payer_open_id", nullable: true, length: 255 })
  public payerOpenId: string | null;

  @Column("decimal", { name: "total", precision: 8, scale: 2 })
  public total: string;

  @Column("decimal", {
    name: "payer_total",
    nullable: true,
    precision: 8,
    scale: 2,
  })
  public payerTotal: string | null;

  @Column("varchar", { name: "currency", nullable: true, length: 255 })
  public currency: string | null;

  @Column("varchar", { name: "payer_currency", nullable: true, length: 128 })
  public payerCurrency: string | null;

  @Column("datetime", { name: "created_at" })
  public createdAt: Date;

  @Column("varchar", { name: "mobile", length: 64 })
  public mobile: string;

  // 微信系统的单号
  @Column("varchar", { name: "transaction_id", length: 64 })
  public transactionId: string;
}
