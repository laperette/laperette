exports.up = async (knex) => {
  await knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("companions");
  });
  await knex.schema.alterTable("bookings", (table) => {
    table.integer("companions");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("companions");
  });
  await knex.schema.alterTable("bookings", (table) => {
    table.string("companions");
  });
};
