import { Invite } from "discord.js";
import { Guild as GuildModel } from "../entities/guild.entity";
import { User as UserModel } from "../entities/user.entity";
import { Invite as InviteModel } from "../entities/invite.entity";

export const name = "inviteCreate";

export const once = false;

export const execute = async (invite: Invite): Promise<void> => {
  let inviter = invite.inviter;
  if (!inviter) {
    inviter = (await invite.inviter?.fetch()) || null;
  }

  let userInstance = await UserModel.findOne(invite.inviter?.id);
  if (!userInstance) {
    UserModel.insert({ id: inviter!.id, username: inviter!.username });
  }

  let guild = invite.guild;
  if (!guild) {
    guild = (await invite.guild?.fetch()) || null;
  }

  const guildInstance = await GuildModel.findOne(invite.guild?.id);
  if (!guildInstance) {
    GuildModel.insert({ id: guild!.id, name: guild!.name });
  }

  await InviteModel.insert({
    id: invite.code,
    creator: userInstance,
    guild: guildInstance,
  });
};
