import { UserEntity } from "@/users/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

const channelTypes = ["dm"] as const;

export type ChannelType = (typeof channelTypes)[number];

@Entity({ name: "channels" })
export class ChannelEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: channelTypes })
  type: ChannelType;

  @ManyToMany(() => UserEntity, (user) => user.channels)
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
}
