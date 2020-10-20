import { config } from "./src/config";

export default {
  client: config.database.database_client,
  connection: config.database.database_url,
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    tablename: "knex_migrations",
    directory: "./src/db/migrations",
  },
};
