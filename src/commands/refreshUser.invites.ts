import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { GuildModel } from "../entities/guild.entity";
import { UserModel } from "../entities/user.entity";
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

  let userInstance = await UserModel.findOne(user.id);
  if (!userInstance) {
    userInstance = UserModel.create({ id: user.id, username: user.username });
    await userInstance.save();
  }

  let guildInstance = await GuildModel.findOne(interaction.guildId!);
  if (!guildInstance) {
    guildInstance = GuildModel.create({
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
