import { knex } from "../db/db";
import { emptyTheDatabase } from "./utils";

beforeAll(async () => {
  await knex.migrate.latest();
})

afterEach(async () => {
  await emptyTheDatabase();
});

afterAll(async () => {
  await emptyTheDatabase();
  await knex.destroy();
})
