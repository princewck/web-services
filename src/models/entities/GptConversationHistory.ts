import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("gpt_conversation_history", { schema: "web_service" })
export class GptConversationHistory {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("varchar", { name: "role", nullable: true, length: 255 })
  role: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "是否失败",
    width: 1,
  })
  status: boolean | null;

  @Column("int", {
    name: "prompt_id",
    nullable: true,
    comment: "对应的问题 id",
  })
  promptId: number | null;
}
