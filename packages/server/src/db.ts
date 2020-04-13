import * as Knex from 'knex'
import * as dbconfig from '../knexfile'

export const knex = Knex(dbconfig)

export const getAllBookings = async () => {
  const bookings = await knex('bookings').select()
  return bookings
}

export const getBookingById = async (bookingId: string) => {
  const booking = await knex("bookings").where("id", bookingId);
  return booking
}



