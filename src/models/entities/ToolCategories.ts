import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tool_categories", { schema: "web_service" })
export class ToolCategories {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("varchar", { name: "name", length: 255 })
  public name: string;

  @Column("varchar", { name: "key", length: 255 })
  public key: string;

  @Column("text", { name: "description", nullable: true })
  public description: string | null;

  @Column("text", { name: "icon", nullable: true })
  public icon: string | null;

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
}
