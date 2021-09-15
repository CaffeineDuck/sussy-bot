import { Intents } from "discord.js";
import { SussyBot } from "./bot";
import ormConfig from "./ormConfig";

export const bot = new SussyBot(
  {
    intents: [
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_INVITES,
    ],
  },
  {
    token: process.env.TOKEN!,
    clientId: process.env.CLIENT_ID || "751026843687321660",
    guildId: process.env.GUILD_ID || "876667721302024262",
    env: process.env.NODE_ENV || "developement",
    ormConfig: ormConfig,
  }
);

bot.loadCommands();
bot.loadListeners();

(async () => {
  // await bot.registerCommands();
  await bot.connectDB();
})();

bot.botLogin();
