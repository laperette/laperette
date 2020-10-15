import { knex } from "../db/db";

export const emptyTheDatabase = async () => {
  await knex.raw("TRUNCATE TABLE accounts CASCADE");
  await knex.raw("TRUNCATE TABLE houses CASCADE");
};
