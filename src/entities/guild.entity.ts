import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { UserModel } from "./user.entity";
import { InviteModel } from "./invite.entity";

@Entity("guilds")
export class GuildModel extends BaseEntity {
  @PrimaryColumn("bigint")
  id: string;

  @Column()
  name: string;

  @ManyToMany((_) => UserModel, (user) => user.id)
  @JoinTable()
  users?: UserModel[];

  @OneToMany((_) => InviteModel, (invite) => invite.id)
  invites?: InviteModel[];

  @Column("json", {array: true, nullable: true})
  inviteRole?: InviteRole[]
}
