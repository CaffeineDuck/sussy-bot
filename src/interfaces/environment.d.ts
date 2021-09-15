declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      NODE_ENV?: "development" | "production" | "staging";
      CLIENT_ID?: string;
      GUILD_ID?: string;
      DB_HOST?: string;
      DB_USERNAME?: string;
      DB_PORT?: string;
      DB_DATABASE?: string;
      DB_PASSWORD?: string;
    }
  }
}

export {};
