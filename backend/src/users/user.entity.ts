import { ApiResponseProperty } from "@nestjs/swagger";
import { Entity, Index, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

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
}
