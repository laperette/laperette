import { config } from "./config";

module.exports = {
  client: config.DATABASE_CLIENT,
  connection: config.DATABASE_URL,
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    tablename: "knex_migrations",
  },
};
