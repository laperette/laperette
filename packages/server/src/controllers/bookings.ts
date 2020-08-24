import { Context } from "koa";
import {
  retrieveBookingById,
  retrieveAllBookings,
  updateBookingById,
  retrieveBookingsByInterval,
  insertOneBooking,
} from "../db/bookings";
import {
  validateNewBookingData,
  haveBookingDatesChanged,
  serializeBookingForClient,
  serializeBookingForDBInsert,
  serializeBookingForDBUpdate,
} from "../utils/booking";
import { format } from "date-fns";
import { UpdatedBookingProperties } from "../types/bookings";

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

    const serializedBooking = serializeBookingForDBInsert(newBookingData);

    const newBookingId = await insertOneBooking(serializedBooking);

    ctx.message = "New booking created";
    ctx.body = {
      status: "ok",
      bookingId: newBookingId,
    };
  } catch (error) {
    console.log(error);

    console.log(`Error while creating a booking`);
    ctx.status = 500;
    ctx.message = "Error while creating a booking";
  }
};

export const getBooking = async (ctx: Context) => {
  const { bookingId } = ctx.params;
  try {
    const booking = await retrieveBookingById(bookingId);

    const serializedBooking = serializeBookingForClient(booking);

    ctx.body = {
      booking: serializedBooking,
    };
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

    const serializedBookings = bookings.map(serializeBookingForClient);

    ctx.body = { bookings: serializedBookings };
    ctx.status = 200;
  } catch (error) {
    console.log(`Error while retrieving bookings by interval`);
    ctx.status = 500;
  }
};

export const getBookings = async (ctx: Context) => {
  try {
    const bookings = await retrieveAllBookings();

    const serializedBookings = bookings.map(serializeBookingForClient);

    ctx.body = { bookings: serializedBookings };
    ctx.status = 200;
  } catch (error) {
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
      const bookingDataToUpdate: UpdatedBookingProperties = {
        arrivalTime,
        departureTime,
        comments,
        companions,
      };

      const serializedBooking = serializeBookingForDBUpdate(
        bookingDataToUpdate,
      );

      await updateBookingById(bookingId, serializedBooking);

      ctx.status = 200;
      ctx.message = "Booking updated";
      ctx.body = {
        status: "ok",
      };
      return;
    }

    const bookingDataToUpdate: UpdatedBookingProperties = {
      comments,
      companions,
    };

    const serializedBooking = serializeBookingForDBUpdate(bookingDataToUpdate);

    await updateBookingById(bookingId, serializedBooking);

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
