import * as Knex from "knex";
import { config } from "../config";

export const knex = Knex({
  client: config.DATABASE_CLIENT,
  connection: config.DATABASE_URL,
});

export const getAllBookings = async () => {
  const bookings = await knex("bookings").select();
  return bookings;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await knex("bookings").where("id", bookingId);
  return booking;
};
