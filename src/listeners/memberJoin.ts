import { GuildMember } from "discord.js";
import { GuildModel } from "../entities/guild.entity";
import { InviteModel } from "../entities/invite.entity";
import { UserModel } from "../entities/user.entity";

export const name = "guildMemberAdd";

export const once = false;

export const execute = async (member: GuildMember): Promise<void> => {
  await updateUserInvites(member);

  await UserModel.create({
    id: member.user.id,
    username: member.user.username,
  }).save();
};

export const updateUserInvites = async (member: GuildMember): Promise<void> => {
  const guildInvites = await member.guild.invites.fetch();
  if (!guildInvites) {
    return;
  }

  const guildInvitesInstances = (
    await GuildModel.findOne(member.guild.id, { relations: ["invites"] })
  )?.invites;
  if (!guildInvitesInstances) {
    return;
  }

  const updatedInvites = guildInvitesInstances.filter((inviteInstance) => {
    inviteInstance.uses != guildInvites.get(inviteInstance.id)?.uses;
  });

  for (const invite of updatedInvites) {
    invite.uses = guildInvites.get(invite.id)?.uses || invite.uses;
    await InviteModel.update({ id: invite.id }, invite);
  }
};
