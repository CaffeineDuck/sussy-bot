import { Guild, GuildMember } from "discord.js";
import { Guild as GuildModel } from "../entities/guild.entity";
import { User as UserModel } from "../entities/user.entity";
import { Invite as InviteModel } from "../entities/invite.entity";

export const getUserInvites = async (
  member: GuildMember
): Promise<[InviteModel[], number]> => {
  const userInvites = await InviteModel.findAndCount({
    where: {
      guild: { id: member.guild.id },
      creator: { id: member.id },
    },
    select: [],
  });

  return userInvites;
};

export const refreshUserInvites = async (
  member: GuildMember,
  creator: UserModel,
  guild: GuildModel
): Promise<void> => {
  const userInvites = (await member.guild.invites.fetch())
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
  const members = await getOrCreateMembers(guild, guildInstance);
  for (const { guildMember, userInstance } of members) {
    if (!userInstance) {
      continue;
    }

    await refreshUserInvites(guildMember, userInstance, guildInstance);
  }
};

export const getOrCreateMembers = async (
  guild: Guild,
  guildInstance: GuildModel
): Promise<{ guildMember: GuildMember; userInstance?: UserModel }[]> => {
  await guild.members.fetch();

  const guildMembers = guild.members.cache.map((member, _) => member);
  const memberIds = guildMembers.map((member) => member.user.id);
  console.log(memberIds);

  const membersArray = await UserModel.findByIds(memberIds);
  console.log(membersArray);

  const notFoundMembers = membersArray.filter(
    (user) => !memberIds.includes(user.id)
  );
  console.log(notFoundMembers);

  const notFoundMemberInstances = notFoundMembers.map((user) =>
    UserModel.create({ id: user.id, username: user.username })
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
