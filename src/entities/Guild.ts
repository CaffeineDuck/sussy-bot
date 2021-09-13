import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Invite } from "./Invite";

@Entity()
export class Guild extends BaseEntity {
  @PrimaryColumn("bigint")
  id: number;

  @Column()
  name: string;

  @ManyToMany((_) => User, (user) => user.id)
  users: User[];

  @OneToMany((_) => Invite, (invite) => invite.id)
  invites: Invite[];
}
