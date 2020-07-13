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

export const getAllBookings = async (): Promise<Booking[]> => {
  const bookings = await knex("bookings").select();
  return bookings;
};

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const booking = await knex("bookings").where("booking_id", bookingId).first();
  return booking;
};

export const insertNewBooking = async (newBooking: Booking) => {
  await knex("bookings").insert(newBooking);
};

export const updateBookingById = async (
  bookingId: string,
  dataToUpdate: BookingDataToUpdate,
) => {
  await knex("bookings").where({ booking_id: bookingId }).update(dataToUpdate);
};
