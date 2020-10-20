exports.up = async (knex) => {
  return knex.schema.alterTable("bookings", (table) => {
    table.renameColumn("booking_status", "status");
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("bookings", (table) => {
    table.renameColumn("status", "booking_status");
  });
};
