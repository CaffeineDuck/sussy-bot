import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Guild } from "./guild.entity";

@Entity("invites")
export class Invite extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne((_) => User, (user) => user.id)
  @JoinColumn()
  creator: User;

  @ManyToOne((_) => Guild, (guild) => guild.id)
  @JoinColumn()
  guild: Guild;

  @Column({default: 0})
  uses: number;
}
