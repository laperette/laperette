exports.up = async (knex) => {
  await knex.schema.alterTable("house_memberships", (table) => {
    table.boolean("is_admin").defaultTo(0).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("house_memberships", (table) => {
    table.dropColumn("is_admin");
  });
};
