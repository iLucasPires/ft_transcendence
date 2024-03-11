import { UserEntity } from "@/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export const statusTypes = ["pending", "in_progress", "finished", "terminated"] as const;

export type StatusType = (typeof statusTypes)[number];

export type Score = { leftPlayer: number; rightPlayer: number };

@Entity({ name: "games" })
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "left_player_id" })
  leftPlayer: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "right_player_id" })
  rightPlayer: UserEntity;

  @Column({ type: "enum", enum: statusTypes, default: "pending" })
  status: StatusType;

  @ManyToOne(() => UserEntity, { nullable: true })
  winner?: UserEntity;

  @Column({ name: "score", type: "jsonb", default: { leftPlayer: 0, rightPlayer: 0 } })
  score: Score;

  @Column({ name: "started_at", type: "timestamp with time zone", nullable: true })
  startedAt?: Date;

  @Column({ name: "ended_at", type: "timestamp with time zone", nullable: true })
  endedAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
