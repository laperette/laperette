import * as dotenv from "dotenv";
import * as Knex from "knex";
import * as path from "path";

dotenv.config({ path: "./.env" });

module.exports = async () => {
  const knex = Knex({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(__dirname, "/migrations"),
    },
  });
  await knex.migrate.latest();
};
