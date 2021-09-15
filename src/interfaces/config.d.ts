import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

interface Config {
  token: string;
  clientId: string;
  guildId: string;
  env: "development" | "production" | "staging";
  ormConfig: PostgresConnectionOptions;
}
