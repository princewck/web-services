import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idnam", ["name"], { unique: true })
@Entity("tools", { schema: "web_service" })
export class Tools {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  public name: string;

  @Column("varchar", { name: "key", length: 255 })
  public key: string;

  @Column("text", { name: "description", nullable: true })
  public description: string | null;

  @Column("text", { name: "icon", nullable: true })
  public icon: string | null;

  @Column("int", { name: "category_id", nullable: true, unsigned: true })
  public categoryId: number | null;

  @Column("int", { name: "index" })
  public index: number;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  public createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  public updatedAt: Date | null;

  @Column("text", {
    name: "detail",
    default: () => "",
  })
  public detail: string;
}
