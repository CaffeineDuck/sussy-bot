import { CommandInteraction } from "discord.js";
import { bot } from "../index";

export const name = "interactionCreate";

export const once = false;

export const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const command = bot.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    return interaction.reply({
      content: `There was an error executing the command ${err}`,
      ephemeral: true,
    });
  }
};
