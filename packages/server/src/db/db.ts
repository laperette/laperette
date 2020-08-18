import * as Knex from "knex";
import { config } from "../config";

export const knex = Knex({
  client: config.database_client,
  connection: config.database_url,
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
  },
});

export const tables = ["accounts"];
