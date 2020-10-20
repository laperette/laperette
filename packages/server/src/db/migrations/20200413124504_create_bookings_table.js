exports.up = async (knex) => {
  return knex.schema.createTable("bookings", function (table) {
    table.increments();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.dateTime("start_date").notNullable();
    table.dateTime("end_date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable("bookings");
};
