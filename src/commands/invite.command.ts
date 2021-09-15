import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { bot } from "../index";

export const data = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Get the invite of the bot");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(
    `https://discord.com/api/oauth2/authorize?client_id=${bot.user?.id}&permissions=8&scope=bot`
  );
};
