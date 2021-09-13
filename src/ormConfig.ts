import dotenv from "dotenv";
import "reflect-metadata";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

dotenv.config({ path: ".env.local" });

export default {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USERNAME ?? "test",
  password: process.env.DB_PASSWORD ?? "test",
  database: process.env.DB_DATABASE ?? "sussy_bot",
  synchronize: false,
  logging: false,
  entities: ["dist/entities/**/*.{ts,js}"],
  migrations: ["src/migrations/**/*.{ts,js}"],
  subscribers: ["dist/subscribers/**/*.{ts,js}"],
  cli: {
    entitiesDir: "dist/entities",
    migrationsDir: "src/migrations",
    subscribersDir: "dist/subscribers",
  },
} as PostgresConnectionOptions;
