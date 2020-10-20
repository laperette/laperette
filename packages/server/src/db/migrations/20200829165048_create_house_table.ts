import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("houses", (table) => {
    table.increments();
    table.uuid("house_id").defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.string("name");
  });

  await knex.schema.createTable("house_memberships", (table) => {
    table.increments();
    table.uuid("account_id").notNullable();
    table.foreign("account_id").references("account_id").inTable("accounts");
    table.uuid("house_id").notNullable();
    table.foreign("house_id").references("house_id").inTable("houses");
  });

  await knex.schema.alterTable("bookings", (table) => {
    table.uuid("house_id").notNullable();
    table.foreign("house_id").references("house_id").inTable("houses");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("bookings", (table) => {
    table.dropForeign(["house_id"]);
    table.dropColumn("house_id");
  });

  await knex.schema.dropTableIfExists("house_memberships");

  await knex.schema.dropTableIfExists("houses");
}
