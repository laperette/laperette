import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("sessions", (table) => {
    table
      .uuid("session_id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable()
      .alter();
    table.uuid("account_id").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.string("session_id").notNullable().alter();
    table.string("account_id").notNullable().alter();
  });
}
