import { ApiResponseProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "files" })
export class FileEntity {
  @ApiResponseProperty({ type: String, format: "uuid" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiResponseProperty({ type: String, example: "0ec2bb4ae60e07898edf0.jpg" })
  @Column()
  path: string;
}
