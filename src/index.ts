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
    clientId: process.env.CLIENT_ID || '751026843687321660',
    guildId: process.env.GUILD_ID || '876667721302024262',
    env: process.env.NODE_ENV || 'developement',
  }
);

bot.loadCommands();
bot.loadListeners();

(async () => {
  await bot.registerCommands()
})()

bot.botLogin();
