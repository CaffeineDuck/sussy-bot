import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getUserInvites } from "../utils/invite.utils";

export const data = new SlashCommandBuilder()
  .setName("invites")
  .setDescription("Get invites in the current guild")
  .addUserOption((option) =>
    option.setName("user").setDescription("User to get info").setRequired(false)
  );

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.options.getUser("user") || interaction.user;
  const member = await interaction.guild!.members.fetch(user.id);
  const [_, count] = await getUserInvites(member);

  await interaction.reply({
    content: `**${user.username}** has **${count}** invites in **${interaction.guild?.name}**.`,
  });
};

export const guildRequired = true;