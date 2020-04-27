require("dotenv").config({ path: "./.env" });

interface Config {
  database_client: string;
  database_url: string;
  token: {
    token_secret: string;
    expiresIn: number;
  };
}

export const config = {
  database_client: "postgres",
  database_url: process.env.DATABASE_URL,
  token: {
    token_secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.JWT_EXPIRY,
  },
};
