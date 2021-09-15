import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserModel } from "./user.entity";
import { GuildModel } from "./guild.entity";

@Entity("invites")
export class InviteModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne((_) => UserModel, (user) => user.id)
  @JoinColumn()
  creator: UserModel;

  @ManyToOne((_) => GuildModel, (guild) => guild.id)
  @JoinColumn()
  guild: GuildModel;

  @Column({default: 0})
  uses: number;
}
