import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("is_admin");
  });
}
