import * as Knex from "knex";
import { config } from "../../config";

export const knex = Knex({
  client: config.DATABASE_CLIENT,
  connection: config.DATABASE_URL,
});
