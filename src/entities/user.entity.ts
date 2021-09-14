import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Guild } from "./guild.entity";
import { Invite } from "./invite.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("bigint")
  id: string;

  @Column()
  username: string;

  @ManyToMany((_) => Guild, (guild) => guild.id)
  guilds?: Guild[];

  @OneToMany((_) => Invite, (invite) => invite.id)
  invites?: Invite[];
}
