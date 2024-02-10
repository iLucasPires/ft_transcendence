import { UserEntity } from "@/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity({ name: "messages" })
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  author: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.messages)
  @JoinColumn({ name: "channel_id", referencedColumnName: "id" })
  channel: ChannelEntity;

  @Column({ type: "varchar", length: 250 })
  content: string;

  @Column({
    name: "sent_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  sentAt: Date;
}
