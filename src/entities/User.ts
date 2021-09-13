import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Guild } from "./Guild";
import { Invite } from "./Invite";

@Entity()
export class User {
  @PrimaryColumn("bigint")
  id: number;

  @Column()
  username: string;

  @ManyToMany((_) => Guild, (guild) => guild.id)
  @JoinTable()
  guilds: Guild[];

  @OneToMany((_) => Invite, (invite) => invite.id)
  invites: Invite[];
}
