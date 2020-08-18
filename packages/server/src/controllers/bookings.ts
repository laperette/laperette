import { Context } from "koa";
import {
  retrieveBookingById,
  retrieveAllBookings,
  updateBookingById,
  BookingStatus,
  retrieveBookingsByInterval,
} from "../db/bookings";
import {
  validateNewBookingData,
  createNewBooking,
  haveBookingDatesChanged,
} from "../utils/booking";
import { format, toDate } from "date-fns";

export const createBooking = async (ctx: Context) => {
  const { accountId } = ctx.params;
  const { arrivalTime, departureTime, comments, companions } = ctx.request.body;
  try {
    const newBookingData = {
      accountId,
      arrivalTime,
      departureTime,
      comments,
      companions,
    };

    const isValidData = !!(await validateNewBookingData(newBookingData));

    if (!isValidData) {
      ctx.status = 400;
      ctx.message = "Impossible to create a booking - Invalid data";
      return;
    }

    const newBookingId = await createNewBooking(newBookingData);

    ctx.message = "New booking created";
    ctx.body = {
      status: "ok",
      bookingId: newBookingId,
    };
  } catch (error) {
    console.log(`Error while creating a booking`);
    console.log(error);
    ctx.status = 500;
    ctx.message = "Error while creating a booking";
  }
};

export const getBooking = async (ctx: Context) => {
  const { bookingId } = ctx.params;
  try {
    const booking = await retrieveBookingById(bookingId);
    ctx.body = booking;
  } catch (error) {
    console.log(`Error while retrieving a booking: ${bookingId}`);
    ctx.status = 500;
  }
};

export const getBookingsByInterval = async (ctx: Context) => {
  try {
    const { start, end } = ctx.query;

    if (!start || !end) {
      console.log(`Could not find query parameters`);
      ctx.status = 500;
    }

    const formattedStart = format(new Date(start), "y/MM/dd");

    const formattedEnd = format(new Date(end), "y/MM/dd");

    const bookings = await retrieveBookingsByInterval(
      formattedStart,
      formattedEnd,
    );

    ctx.body = bookings;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    console.log(`Error while retrieving bookings by interval`);
    ctx.status = 500;
  }
};

export const getBookings = async (ctx: Context) => {
  try {
    const bookings = await retrieveAllBookings();
    ctx.body = bookings;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    console.log(`Error while retrieving all bookings`);
    ctx.status = 500;
  }
};

export const updateBooking = async (ctx: Context) => {
  const { accountId, bookingId } = ctx.params;

  const { arrivalTime, departureTime, comments, companions } = ctx.request.body;
  try {
    const bookingToBeUpdated = await retrieveBookingById(bookingId);

    if (accountId !== bookingToBeUpdated.booker_id) {
      ctx.status = 403;
      ctx.message = "Impossible to update this booking - Invalid booking owner";
      return;
    }

    if (
      haveBookingDatesChanged(bookingToBeUpdated, departureTime, arrivalTime)
    ) {
      const dataToUpdate = {
        arrival_time: arrivalTime,
        departure_time: departureTime,
        comments,
        companions,
        booking_status: "pending" as BookingStatus,
      };

      await updateBookingById(bookingId, dataToUpdate);

      ctx.status = 200;
      ctx.message = "Booking updated";
      ctx.body = {
        status: "ok",
      };
      return;
    }

    const dataToUpdate = {
      comments,
      companions,
    };

    await updateBookingById(bookingId, dataToUpdate);

    ctx.status = 200;
    ctx.message = "Booking updated";
    ctx.body = {
      status: "ok",
    };
    return;
  } catch (error) {
    console.log(`Error while updating a booking`, { bookingId });
    console.log(error);
    ctx.status = 500;
  }
};
