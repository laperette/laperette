exports.up = async (knex) => {
  await knex.schema.alterTable("sessions", (table) => {
    table.dropColumn("account_id");
  });

  await knex.schema.alterTable("sessions", (table) => {
    table.uuid("account_id").notNullable();
    table.foreign("account_id").references("account_id").inTable("accounts");
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("sessions", (table) => {
    table.dropColumn("account_id");
  });
  await knex.schema.alterTable("sessions", (table) => {
    table.string("account_id").notNullable();
  });
};
