import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { GuildModel } from "../entities/guild.entity";
import { refreshGuildInvites } from "../utils/invite.utils";

export const data = new SlashCommandBuilder()
  .setName("refresh_guild_invites")
  .setDescription("Refreshes invites in the current guild");

export const execute = async (interaction: CommandInteraction) => {
  const guild = interaction.guild!;

  await interaction.deferReply();

  let guildInstance = await GuildModel.findOne(guild.id);
  if (!guildInstance) {
    guildInstance = await GuildModel.create({
      id: guild.id,
      name: guild.name,
    }).save();
  }

  await refreshGuildInvites(guild, guildInstance);

  await interaction.editReply({
    content: `Invites for **${guild.name}** updated successfully!`,
  });
};

export const guildRequired = true;
