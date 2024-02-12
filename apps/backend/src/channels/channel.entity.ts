import { UserEntity } from "@/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MessageEntity } from "./messages.entity";

export const channelTypes = ["dm", "group"] as const;

export type ChannelType = (typeof channelTypes)[number];

@Entity({ name: "channels" })
export class ChannelEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: String, nullable: true })
  name?: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  owner?: UserEntity;

  @Column({ type: "enum", enum: channelTypes })
  type: ChannelType;

  @ManyToMany(() => UserEntity, (user) => user.channels, { eager: true })
  @JoinTable({
    name: "channel_members",
    joinColumn: {
      name: "channel_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "member_id",
      referencedColumnName: "id",
    },
  })
  members: Array<UserEntity>;

  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages: Array<MessageEntity>;

  @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;
}
