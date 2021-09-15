import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, PermissionFlags } from "discord.js";

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
  guildRequired?: boolean = false;
  requiredPermission?: PermissionFlags;
}
