import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const config = {
  cookies: {
    session: process.env.SESSION_COOKIE,
  },
  database_client: "postgres",
  database_url: process.env.DATABASE_URL,

  corsOrigin: process.env.CORS_ORIGIN,
};