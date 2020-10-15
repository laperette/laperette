exports.up = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.string("password");
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("password");
  });
};
