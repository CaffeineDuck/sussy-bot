import { Intents } from "discord.js";
import { SussyBot } from "./bot";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const bot = new SussyBot(
  { intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS] },
  {
    token: process.env.TOKEN!,
    commandDirPath: path.join(__dirname, "commands"),
    listenerDirPath: path.join(__dirname, "listeners"),
  }
);

bot.loadCommands();
bot.loadListeners();

bot.botLogin();
