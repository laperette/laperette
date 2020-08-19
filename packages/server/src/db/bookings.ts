import { knex } from "./db";

export type BookingStatus = "pending" | "accepted" | "rejected";

export interface Booking {
  booker_id: string;
  arrival_time: Date;
  departure_time: Date;
  comments: string;
  companions: string[];
  booking_status: BookingStatus;
}

export interface BookingDataToUpdate {
  arrival_time?: Date;
  departure_time?: Date;
  comments: string;
  companions: string[];
  booking_status?: BookingStatus;
}

export const retrieveAllBookings = async (): Promise<Booking[]> => {
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
): Promise<Booking> => {
  const booking = await knex("bookings")
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
    .where("booking_id", bookingId)
    .first();
  return booking;
};

export const retrieveBookingsByInterval = async (
  start: string,
  end: string,
) => {
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

export const insertOneBooking = async (newBooking: Booking) => {
  await knex("bookings").insert(newBooking);
};

export const updateBookingById = async (
  bookingId: string,
  dataToUpdate: BookingDataToUpdate,
) => {
  await knex("bookings").where({ booking_id: bookingId }).update(dataToUpdate);
};
