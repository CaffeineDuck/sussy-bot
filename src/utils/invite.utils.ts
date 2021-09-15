import { Guild, GuildMember } from "discord.js";
import { GuildModel } from "../entities/guild.entity";
import { UserModel } from "../entities/user.entity";
import { InviteModel } from "../entities/invite.entity";
import { MoreThanOrEqual } from "typeorm";

export const getUserInvites = async (
  member: GuildMember
): Promise<[InviteModel[], number]> => {
  const userInvites = await InviteModel.find({
    where: {
      guild: { id: member.guild.id },
      creator: { id: member.id },
      uses: MoreThanOrEqual(1),
    },
    select: ["uses"],
  });

  const uses = userInvites
    .map((invite) => invite.uses)
    .reduce((total, currentUse) => total + currentUse, 0);
  return [userInvites, uses];
};

export const refreshUserInvites = async (
  member: GuildMember,
  creator: UserModel,
  guild: GuildModel
): Promise<void> => {
  const userInvites = member.guild.invites.cache
    .filter((invite) => invite.inviter?.id === member.id)
    .values();

  if (!userInvites) {
    return;
  }

  const [userInviteInstance, _] = await getUserInvites(member);

  for (const invite of userInvites) {
    const prevInviteInstance = userInviteInstance.find(
      (prevInvite) => prevInvite.id === invite.code
    );

    if (prevInviteInstance && prevInviteInstance.uses === invite.uses) {
      continue;
    }

    const inviteInstance = InviteModel.create({
      id: invite.code,
      uses: invite.uses ?? 0,
      guild: guild,
      creator: creator,
    });
    await inviteInstance.save();
  }
};

export const refreshGuildInvites = async (
  guild: Guild,
  guildInstance: GuildModel
) => {
  await guild.invites.fetch();

  const members = await getOrCreateMembers(guild, guildInstance);
  const tasks: Promise<any>[] = [];

  for (const { guildMember, userInstance } of members) {
    if (!userInstance) {
      continue;
    }

    tasks.push(refreshUserInvites(guildMember, userInstance, guildInstance));
  }

  await Promise.all(tasks);
};

export const getOrCreateMembers = async (
  guild: Guild,
  guildInstance: GuildModel
): Promise<{ guildMember: GuildMember; userInstance?: UserModel }[]> => {
  await guild.members.fetch();

  const guildMembers = guild.members.cache.map((member, _) => member);
  const memberIds = guildMembers.map((member) => member.user.id);

  const membersArray = await UserModel.findByIds(memberIds);

  const notFoundMembers = guildMembers.filter(
    (member) =>
      !membersArray.find((memberInstance) => memberInstance.id === member.id)
  );

  const notFoundMemberInstances = notFoundMembers.map((member) =>
    UserModel.create({ id: member.id, username: member.user.username })
  );

  await UserModel.insert(notFoundMemberInstances);
  membersArray.push(...notFoundMemberInstances);

  const memberInstanceMap = guildMembers.map((member) => {
    return {
      guildMember: member,
      userInstance: membersArray.find((user) => user.id === member.id),
    };
  });

  guildInstance.users = guildInstance?.users
    ? [...notFoundMemberInstances, ...guildInstance.users!]
    : notFoundMemberInstances;
  await guildInstance.save();

  return memberInstanceMap;
};
