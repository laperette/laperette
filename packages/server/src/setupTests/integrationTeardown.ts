import { knex } from "../db/db";
import { emptyTheDatabase } from "./utils";

export default async function () {
  await emptyTheDatabase();
  await knex.destroy();
  process.exit(0);
}
