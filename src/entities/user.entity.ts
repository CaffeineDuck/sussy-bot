import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { GuildModel } from "./guild.entity";
import { InviteModel } from "./invite.entity";

@Entity("users")
export class UserModel extends BaseEntity {
  @PrimaryColumn("bigint")
  id: string;

  @Column()
  username: string;

  @ManyToMany((_) => GuildModel, (guild) => guild.id)
  guilds?: GuildModel[];

  @OneToMany((_) => InviteModel, (invite) => invite.id)
  invites?: InviteModel[];
}
