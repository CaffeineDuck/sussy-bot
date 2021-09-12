import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const TOKEN = process.env.TOKEN!;
const COMMAND_DIR = path.join(__dirname, "../commands");

const commandFiles = readdirSync(COMMAND_DIR).filter((file: string) =>
  file.endsWith(".js")
);

const clientId = "751026843687321660";
const guildId = "876667721302024262";

const loadCommands = async () => {
  const commands: JSON[] = [];

  for (const file of commandFiles) {
    const command = await import(`${COMMAND_DIR}/${file}`);
    commands.push(command.data.toJSON());
    console.log(command);
  }

  return commands;
};

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
  try {
    const commands = await loadCommands();
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
