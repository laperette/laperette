require("dotenv").config({ path: "./.env" });

export const config = {
  DATABASE_CLIENT: "postgres",
  DATABASE_URL: process.env.DATABASE_URL,
  token: {
    token_secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.JWT_EXPIRY,
  },
};
