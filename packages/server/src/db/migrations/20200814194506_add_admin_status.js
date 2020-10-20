exports.up = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("is_admin");
  });
};
