import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { bot } from "../index";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply({ content: bot.ws.ping.toString(), ephemeral: true });
};

