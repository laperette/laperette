import * as Knex from 'knex'
import * as dbconfig from '../knexfile'

export const knex = Knex(dbconfig)
export const getBookingById = async (bookingId: string) =>
  knex.table("appointments").where("booking_id", bookingId);
