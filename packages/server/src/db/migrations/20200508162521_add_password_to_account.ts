import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.string("password");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("password");
  });
}
