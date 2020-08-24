import { knex } from "./db";
import {
  BookingFromDB,
  BookingForDBInsert,
  BookingForDBUpdate,
} from "../types/bookings";

export const retrieveAllBookings = async (): Promise<BookingFromDB[]> => {
  const bookings = await knex("bookings")
    .select(
      "bookings.booking_id",
      "accounts.first_name",
      "accounts.last_name",
      "bookings.departure_time",
      "bookings.arrival_time",
      "bookings.status",
      "bookings.comments",
      "bookings.companions",
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id");
  return bookings;
};

export const retrieveBookingById = async (
  bookingId: string,
): Promise<BookingFromDB> => {
  const booking = await knex("bookings")
    .select(
      "bookings.booking_id",
      "bookings.booker_id",
      "accounts.first_name",
      "accounts.last_name",
      "bookings.departure_time",
      "bookings.arrival_time",
      "bookings.status",
      "bookings.comments",
      "bookings.companions",
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id")
    .where("booking_id", bookingId)
    .first();
  return booking;
};

export const retrieveBookingsByInterval = async (
  start: string,
  end: string,
): Promise<BookingFromDB[]> => {
  const bookings = await knex("bookings")
    .select(
      "bookings.booking_id",
      "accounts.first_name",
      "accounts.last_name",
      "bookings.departure_time",
      "bookings.arrival_time",
      "bookings.status",
      "bookings.comments",
      "bookings.companions",
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id")
    .where(
      knex.raw(
        "bookings.arrival_time BETWEEN  ? AND ? OR bookings.departure_time BETWEEN  ? AND ? ",
        [start, end, start, end],
      ),
    );

  return bookings;
};

export const insertOneBooking = async (
  newBooking: BookingForDBInsert,
): Promise<string> => {
  const [bookingId] = await knex("bookings")
    .insert(newBooking)
    .returning("booking_id");
  return bookingId;
};

export const updateBookingById = async (
  bookingId: string,
  dataToUpdate: BookingForDBUpdate,
): Promise<void> => {
  await knex("bookings").where({ booking_id: bookingId }).update(dataToUpdate);
};
