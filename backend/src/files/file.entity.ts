import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "files" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  path: string;
}
