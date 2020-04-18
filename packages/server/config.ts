require("dotenv").config();
require("dotenv").config({ path: "./.env.local" });

export const config = {
  DATABASE_CLIENT: "postgres",
  DATABASE_URL: process.env.DATABASE_URL,
};
