import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("is_member");
    table.dropColumn("is_admin");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("accounts", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
    table.boolean("is_member").defaultTo(0).notNullable();
  });
}
