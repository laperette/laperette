import { Context } from "koa";
import { getBookingById, getAllBookings } from "../db";

export const getBooking = async (ctx: Context) => {
  const { bookingId } = ctx.params
  try {
    const booking = await getBookingById(bookingId);
    ctx.body = booking;
  } catch (error) {
    console.log(`Error while retrieving a booking: ${bookingId}`)
    console.log(error)
    ctx.status = 500;
  }
}

export const getBookings = async (ctx: Context) => {
  try {
    const bookings = await getAllBookings();
    ctx.body = bookings;
    ctx.status = 200
  } catch (error) {
    console.log(`Error while retrieving all bookings`)
    ctx.status = 500;
  }
}

