require("dotenv").config({ path: "./.env" });

interface Config {
  database_client: string;
  database_url: string;
  token: {
    token_secret: string;
    expiresIn: number;
  };
}

export const config: Config = {
  database_client: "postgres",
  database_url: process.env.DATABASE_URL,
  token: {
    expiresIn: parseInt(process.env.TOKEN_EXPIRY, 10),
    length: parseInt(process.env.TOKEN_LENGTH, 10),
  },
};
