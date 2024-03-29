import { UserEntity } from "@/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MessageEntity } from "./messages.entity";

export const channelTypes = ["dm", "group"] as const;

export type ChannelType = (typeof channelTypes)[number];

export const channelVisibility = ["dm", "public", "private"] as const;

export type ChannelVisibility = (typeof channelVisibility)[number];

@Entity({ name: "channels" })
export class ChannelEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: String, nullable: true })
  name?: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: "owner_id" })
  owner?: Partial<UserEntity>;

  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable({
    name: "channel_admins",
    joinColumn: {
      name: "channel_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "admin_id",
      referencedColumnName: "id",
    },
  })
  admins?: Array<Partial<UserEntity>>;

  @Column({ type: "enum", enum: channelTypes })
  type: ChannelType;

  @Column({ type: "enum", enum: channelVisibility })
  visibility: ChannelVisibility;

  @Column({ name: "hashed_password", type: String, nullable: true, select: false })
  hashedPassword?: string;

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
  members: Array<Partial<UserEntity>>;

  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages?: Array<MessageEntity>;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: "channel_bans",
    joinColumn: {
      name: "channel_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "banned_id",
      referencedColumnName: "id",
    },
  })
  bans?: Array<Partial<UserEntity>>;

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
