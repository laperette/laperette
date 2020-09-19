import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("house_memberships", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("house_memberships", (table) => {
    table.dropColumn("is_admin");
  });
}
