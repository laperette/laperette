exports.up = async (knex) => {
  await knex.schema.alterTable("houses", (table) => {
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("house_memberships", (table) => {
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("houses", (table) => {
    table.dropColumn("created_at");
    table.dropColumn("updated_at");
  });

  await knex.schema.alterTable("house_memberships", (table) => {
    table.dropColumn("created_at");
    table.dropColumn("updated_at");
  });
};
