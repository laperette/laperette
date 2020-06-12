require("dotenv").config({ path: "./.env" });

interface Config {
  cookies: {
    session: string;
  };
  database_client: string;
  database_url: string;
  token: {
    expiresIn: number;
    length: number;
  };
}

export const config: Config = {
  cookies: {
    session: process.env.SESSION_COOKIE,
  },
  database_client: "postgres",
  database_url: process.env.DATABASE_URL,
  token: {
    expiresIn: parseInt(process.env.TOKEN_EXPIRY, 10),
    length: parseInt(process.env.TOKEN_LENGTH, 10),
  },
};
