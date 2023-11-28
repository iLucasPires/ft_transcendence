import { Entity, Index, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique("intra_unique_constraint", ["intraId", "email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  @Index({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  intraId: number;

  @Column()
  displayName: string;

  @Column({ default: false })
  registrationComplete: boolean;
}
