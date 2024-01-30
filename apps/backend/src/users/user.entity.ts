import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

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

  @Exclude()
  @Column({ name: "intra_id", unique: true, select: false })
  intraId?: number;

  @ApiResponseProperty({ type: String })
  @Column({ name: "avatar_url", nullable: true })
  avatarUrl?: string;

  @ApiResponseProperty({ type: Boolean, example: false })
  @Column({ name: "registration_complete", default: false })
  registrationComplete: boolean;

  @Column({ name: "is_two_factor_auth_enabled", type: Boolean, default: false })
  @Exclude()
  isTwoFactorAuthEnabled: boolean;

  @Column({
    name: "two_factor_auth_secret",
    type: String,
    nullable: true,
    select: false,
  })
  @Exclude()
  twoFactorAuthSecret?: string;

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers, { lazy: true })
  @JoinTable({
    name: "blocked_users",
    joinColumn: {
      name: "blocked_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "blocker_id",
      referencedColumnName: "id",
    },
  })
  blockedBy?: Promise<UserEntity[]>;

  @ManyToMany(() => UserEntity, (user) => user.blockedBy)
  blockedUsers?: Promise<UserEntity[]>;

  @ManyToMany(() => UserEntity, { lazy: true })
  @JoinTable({
    name: "friendships",
    joinColumn: {
      name: "friend_1_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "friend_2_id",
      referencedColumnName: "id",
    },
  })
  friends?: Promise<UserEntity[]>;
}
