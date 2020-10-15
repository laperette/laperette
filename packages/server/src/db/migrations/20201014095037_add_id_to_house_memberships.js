exports.up = async (knex) => {
  return knex.schema.alterTable("house_memberships", (table) => {
    table.uuid("house_membership_id").defaultTo(knex.raw("uuid_generate_v4()"));
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("house_memberships", (table) => {
    table.dropColumn("house_membership_id");
  });
};
