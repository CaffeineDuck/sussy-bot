import { Guild } from "discord.js";
import { GuildModel } from "../entities/guild.entity";

export const name = "guildCreate";

export const once = false;

export const execute = async (guild: Guild): Promise<void> => {
  await GuildModel.create({ id: guild.id, name: guild.name }).save();
};
