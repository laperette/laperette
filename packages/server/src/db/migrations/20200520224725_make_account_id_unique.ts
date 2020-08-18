import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table
      .uuid("account_id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable()
      .alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.uuid("account_id").defaultTo(knex.raw("uuid_generate_v4()")).alter();
  });
}
