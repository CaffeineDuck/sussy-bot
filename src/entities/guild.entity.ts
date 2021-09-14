import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { User } from "./user.entity";
import { Invite } from "./invite.entity";

@Entity("guilds")
export class Guild extends BaseEntity {
  @PrimaryColumn("bigint")
  id: string;

  @Column()
  name: string;

  @ManyToMany((_) => User, (user) => user.id)
  @JoinTable()
  users?: User[];

  @OneToMany((_) => Invite, (invite) => invite.id)
  invites?: Invite[];

  @Column("json", {array: true, nullable: true})
  inviteRole?: InviteRole[]
}
