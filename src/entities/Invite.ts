import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Guild } from "./Guild";

@Entity()
export class Invite extends BaseEntity {
  @PrimaryColumn("bigint")
  id: string;

  @ManyToOne((_) => User, (user) => user.id)
  creator: User;

  @ManyToOne((_) => Guild, (guild) => guild.id)
  guild: Guild;

  @Column()
  uses: number;
}
