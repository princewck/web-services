import { Column, Entity, Generated, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity("gpt_templates", { schema: "web_service" })
export class GptTemplates {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("text", { name: "prompt", nullable: true })
  prompt: string | null;

  @Column({name: "created_at", type: 'timestamp', default: "CURRENT_TIMESTAMP"})
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column("int", { name: "created_by", nullable: true, comment: "admin id" })
  createdBy: number | null;
}
