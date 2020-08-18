import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.alterTable("accounts", (table) => {
    table.uuid("account_id").defaultTo(knex.raw("uuid_generate_v4()"));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("account_id");
  });
}
