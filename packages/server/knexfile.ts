import { config } from './config'

module.exports = {
  client: "postgres",
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  },
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    tablename: "knex_migrations",
  },
};