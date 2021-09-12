import { Client, ClientOptions, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "./types/command";
import { Listener } from "./types/listener";

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
    this.commandFiles = readdirSync(config.commandDirPath).filter((file) =>
      file.endsWith(".js")
    );
    this.listenerFiles = readdirSync(config.listenerDirPath).filter((file) =>
      file.endsWith(".js")
    );
  }

  loadCommands() {
    for (const file of this.commandFiles) {
      const command = require(`${this.config.commandDirPath}/${file}`);
      this.commands.set(command.data.name, command);

      console.log(`[load] COMMAND: ${command.data.name}`);
    }
    return this.commands;
  }

  loadListeners() {
    for (const file of this.listenerFiles) {
      const listener: Listener = require(`${this.config.listenerDirPath}/${file}`);
      if (listener.once) {
        this.once(listener.name, (...args) => listener.execute(...args));
      } else {
        this.on(listener.name, (...args) => listener.execute(...args));
      }

      console.log(`[load] LISTENER: ${listener.name}`);
    }
  }

  botLogin(token?: string) {
    return this.login(token || this.config.token);
  }
}
