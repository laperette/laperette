exports.up = async (knex) => {
  return knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("first_name");
    table.dropColumn("last_name");
    table.dropColumn("start_date");
    table.dropColumn("end_date");
    table.uuid("booking_id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("booker_id").notNullable();
    table.foreign("booker_id").references("accounts.account_id");
    table.dateTime("arrival_time").notNullable();
    table.dateTime("departure_time").notNullable();
    table.string("booking_status").notNullable();
    table.text("comments");
    table.string("companions");
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("bookings", (table) => {
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.dateTime("start_date").notNullable();
    table.dateTime("end_date").notNullable();
    table.dropColumn("booking_id");
    table.dropForeign(["booker_id"]);
    table.dropColumn("arrival_time");
    table.dropColumn("departure_time");
    table.dropColumn("booking_status");
    table.dropColumn("comments");
    table.dropColumn("companions");
  });
};
