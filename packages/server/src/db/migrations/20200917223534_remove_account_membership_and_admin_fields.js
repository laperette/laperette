exports.up = async (knex) => {
  await knex.schema.alterTable("accounts", (table) => {
    table.dropColumn("is_member");
    table.dropColumn("is_admin");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("accounts", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
    table.boolean("is_member").defaultTo(0).notNullable();
  });
};
