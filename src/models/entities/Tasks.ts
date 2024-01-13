import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TaskStatus {
  INITIAL = 0,
  PROCESSING = 1,
  FINISHED = 2,
}

@Entity("tasks", { schema: "web_service" })
export class Tasks {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  public id: number;

  @Column("bigint", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  public createdAt: number;

  @Column("varchar", { name: "node_name", length: 255 })
  public nodeName: string;
  @Column("varchar", { name: "task_name", length: 255 })
  public taskName: string;
  @Column("varchar", { name: "desc", length: 255 })
  public desc: string;

  @Column("bigint", { name: "deleted_at", nullable: true })
  public deletedAt: number;

  @Column("tinyint", { name: "status", width: 1, default: () => "'0'" })
  public status: TaskStatus;

  @Column("bigint", { name: "finished_at", nullable: true })
  public finishedAt: number;
}
