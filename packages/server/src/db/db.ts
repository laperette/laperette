import Knex from "knex";
import knexConfig from "../../knexfile";

export const knex = Knex(knexConfig);

export const tables = [
  "accounts",
  "bookings",
  "houses",
  "house_memberships",
  "sessions",
];
