import * as Knex from "knex";
import * as knexConfig from "../../knexfile";

export const knex = Knex(knexConfig);

export const tables = ["accounts", "bookings", "houses", "house_memberships"];
