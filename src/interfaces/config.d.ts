import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export interface Config {
  token: string;
  clientId: string;
  guildId: string;
  env: string;
  ormConfig: PostgresConnectionOptions;
}
