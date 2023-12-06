import { ApiResponseProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity({ name: "users" })
@Unique("intra_unique_constraint", ["intraId", "email"])
export class UserEntity {
  @ApiResponseProperty({ type: String, format: "uuid" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiResponseProperty({ type: String, example: "dezano" })
  @Column({ unique: true })
  @Index({ unique: true })
  username: string;

  @ApiResponseProperty({ type: String, example: "dezano@42sp.org.br" })
  @Column({ unique: true })
  email: string;

  @ApiResponseProperty({ type: Number, example: 10 })
  @Column({ name: "intra_id", unique: true })
  intraId: number;

  @ApiResponseProperty({ type: String })
  @Column({ name: "avatar_url", nullable: true })
  avatarUrl?: string;

  @ApiResponseProperty({ type: Boolean, example: false })
  @Column({ name: "registration_complete", default: false })
  registrationComplete: boolean;

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers, { lazy: true })
  @JoinTable({
    name: "blocked_users",
    joinColumn: {
      name: "blocker_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "blocked_id",
      referencedColumnName: "id",
    },
  })
  blockedBy?: Promise<UserEntity[]>;

  @ManyToMany(() => UserEntity, (user) => user.blockedBy)
  blockedUsers?: Promise<UserEntity[]>;
}
