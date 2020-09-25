import { tables, knex } from "../db/db";

const emptyTheDatabase = () =>
  Promise.all(
    tables.map((table) => knex.raw(`truncate table ${table} cascade`)),
  );

beforeAll(async () => {
  await knex.migrate.latest();
});

afterEach(emptyTheDatabase);

afterAll(async () => {
  await emptyTheDatabase();
  await knex.destroy();
});
