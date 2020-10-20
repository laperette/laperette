exports.up = async (knex) => {
  return knex.schema.alterTable("sessions", (table) => {
    table
      .uuid("session_id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable()
      .alter();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("sessions", (table) => {
    table.string("session_id").notNullable().alter();
  });
};
