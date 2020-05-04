import { Booking } from "../domain/Booking";

import { knex } from "./db";

export const getAllBookings = async () => {
  const bookings = await knex<ReadonlyArray<Booking>>("bookings").select();
  return bookings;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await knex<Booking>("bookings").where("id", bookingId);
  return booking;
};
