import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Guild } from "../entities/guild.entity";
import { User } from "../entities/user.entity";
import { refreshUserInvites } from "../utils/invite.utils";

export const data = new SlashCommandBuilder()
  .setName("refresh_invites")
  .setDescription("Refreshes invites in the current guild")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("User to refresh invites")
      .setRequired(false)
  );

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.options.getUser("user") || interaction.user;
  const member = await interaction.guild!.members.fetch(user.id);

  let userInstance = await User.findOne(user.id);
  if (!userInstance) {
    userInstance = User.create({ id: user.id, username: user.username });
    await userInstance.save();
  }

  let guildInstance = await Guild.findOne(interaction.guildId!);
  if (!guildInstance) {
    guildInstance = Guild.create({
      id: interaction.guild!.id,
      name: interaction.guild!.name,
    });
    await guildInstance.save();
  }

  await refreshUserInvites(member, userInstance, guildInstance);

  await interaction.reply({
    content: `**${user.username}**'s invites have been refreshed in **${interaction.guild?.name}**.`,
  });
};

export const guildRequired = true;
