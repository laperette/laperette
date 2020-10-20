exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.alterTable("accounts", (table) => {
    table.uuid("account_id").defaultTo(knex.raw("uuid_generate_v4()"));
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("account_id");
  });
};
