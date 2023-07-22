import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("gpt_conversations", { schema: "web_service" })
export class GptConversations {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("varchar", { name: "name", length: 255 })
  public name: string;

  @Column("int", { name: "template_id", nullable: true })
  public templateId: number | null;

  @Column("int", { name: "user_id", nullable: true })
  public userId: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  public createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  public updatedAt: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  public deletedAt: Date | null;
}
