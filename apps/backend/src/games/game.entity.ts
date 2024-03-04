import { UserEntity } from "@/users/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @ManyToOne(() => UserEntity, { nullable: true })
  winner?: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
