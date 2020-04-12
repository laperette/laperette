require("dotenv").config();

import * as Knex from "knex";

const config = {
  client: "postgres",
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 20,
  },
  // migrations: {
  //   tablename: "knex_migrations",
  // },
};

const db = Knex(config);

export const getBooking = async (bookingId: string) => {
  await db.table("appointments").where("booking_id", bookingId);
};
