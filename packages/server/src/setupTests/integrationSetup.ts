import { knex } from "../db/db";

export default async function () {
  await knex.migrate.latest();
}
