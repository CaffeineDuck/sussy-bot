import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { Client, ClientOptions, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "@interfaces/command";
import { Config } from "@interfaces/config";
import path from "path";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createConnection } from "typeorm";

export class SussyBot extends Client {
  config: Config;
  commands = new Collection<string, Command>();
  commandFiles: string[];
  listenerFiles: string[];

  constructor(clientOptions: ClientOptions, config: Config) {
    super(clientOptions);
    if (!config) {
      throw new Error("Config not provided");
    }
    this.config = config;
    this.commandFiles = readdirSync(path.join(__dirname, "commands")).filter(
      (file) => file.endsWith(".js")
    );
    this.listenerFiles = readdirSync(path.join(__dirname, "listeners")).filter(
      (file) => file.endsWith(".js")
    );
  }

  loadCommands() {
    for (const file of this.commandFiles) {
      const command: Command = require(`./commands/${file}`);
      this.commands.set(command.data.name, command);

      console.log(`[load] COMMAND: ${file}`);
    }
    return this.commands;
  }

  loadListeners() {
    for (const file of this.listenerFiles) {
      const listener: Listener = require(`./listeners/${file}`);
      if (listener.once) {
        this.once(listener.name, (...args) => listener.execute(...args));
      } else {
        this.on(listener.name, (...args) => listener.execute(...args));
      }

      console.log(`[load] LISTENER: ${file}`);
    }
  }

  async registerCommands(token?: string) {
    try {
      const rest = new REST({ version: "9" }).setToken(
        token || this.config.token
      );

      const commandValues = this.commands.mapValues((command) =>
        command.data.toJSON()
      );

      await rest.put(
        this.config.env === "developement"
          ? Routes.applicationGuildCommands(
              this.config.clientId,
              this.config.guildId
            )
          : Routes.applicationCommands(this.config.clientId),
        {
          body: commandValues,
        }
      );

      console.log(
        this.config.env === "developement"
          ? "[register] GUILD commands registered"
          : "[register] GLOBAL commands registered"
      );
    } catch (error) {
      console.error(error);
    }
  }

  botLogin(token?: string) {
    return this.login(token || this.config.token);
  }

  async connectDB(ormConfig?: PostgresConnectionOptions) {
    await createConnection(ormConfig || this.config.ormConfig);
    console.log('[database] Connected to DB')
  }
}
