import { config } from "./config";

module.exports = {
  client: config.database_client,
  connection: config.database_url,
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    tablename: "knex_migrations",
  },
};
