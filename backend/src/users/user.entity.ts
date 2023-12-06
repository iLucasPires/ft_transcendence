import { Entity, Index, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "users" })
@Unique("intra_unique_constraint", ["intraId", "email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  @Index({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "intra_id", unique: true })
  intraId: number;

  @Column({ name: "avatar_url", nullable: true })
  avatarUrl?: string;

  @Column({ name: "registration_complete", default: false })
  registrationComplete: boolean;
}
