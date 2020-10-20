exports.up = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table
      .uuid("account_id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable()
      .alter();
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.uuid("account_id").defaultTo(knex.raw("uuid_generate_v4()")).alter();
  });
};
