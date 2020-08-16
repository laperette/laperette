import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("bookings", (table) => {
    table.renameColumn("booking_status", "status");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("bookings", (table) => {
    table.renameColumn("status", "booking_status");
  });
}
