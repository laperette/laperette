exports.up = async (knex) => {
  return knex.schema.createTable("sessions", function (table) {
    table.increments();
    table.string("session_id").notNullable();
    table.string("account_id").notNullable();
    table.dateTime("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable("sessions");
};
