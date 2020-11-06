import { knex } from "./db";
import {
  BookingFromDB,
  BookingForDBInsert,
  BookingForDBUpdate,
} from "../types/bookings";

export const retrieveBookingsByAccountId = async (
  accountId: string,
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
      "bookings.house_id",
      "houses.name",
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id")
    .join("houses", "houses.house_id", "bookings.house_id")
    .where({ account_id: accountId });
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
      "bookings.house_id",
      "houses.name",
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id")
    .join("houses", "houses.house_id", "bookings.house_id")
    .where("booking_id", bookingId)
    .first();
  return booking;
};

export const retrieveHouseBookingsByInterval = async (
  start: string,
  end: string,
  houseId: string,
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
      "bookings.house_id",
      // TODO: Add house name using join
    )
    .join("accounts", "accounts.account_id", "bookings.booker_id")
    .where(
      knex.raw(
        "house_id = ? AND bookings.arrival_time BETWEEN  ? AND ? OR house_id = ? AND bookings.departure_time BETWEEN  ? AND ?",
        [houseId, start, end, houseId, start, end],
      ),
    );

  return bookings;
};

export const insertOneBooking = async (
  newBooking: BookingForDBInsert,
): Promise<void> => {
  await knex("bookings").insert(newBooking);
};

export const updateBookingById = async (
  bookingId: string,
  dataToUpdate: BookingForDBUpdate,
): Promise<void> => {
  await knex("bookings").update(dataToUpdate).where({ booking_id: bookingId });
};

export const deleteBookingById = async (bookingId: string): Promise<void> => {
  await knex("bookings").del().where({ booking_id: bookingId });
};
