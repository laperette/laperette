import { Context } from "koa";
import {
  retrieveBookingById,
  updateBookingById,
  retrieveHouseBookingsByInterval,
  insertOneBooking,
  retrieveBookingsByAccountId,
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
import { logger, sanitizeError } from "../logger";

export const createBooking = async (ctx: Context) => {
  const { accountId } = ctx.state;
  const { houseId } = ctx.params;

  const { arrivalTime, departureTime, comments, companions } = ctx.request.body;

  try {
    const newBookingData = {
      accountId,
      arrivalTime,
      departureTime,
      comments,
      companions,
      houseId,
    };

    console.log(newBookingData);

    const isValidData = !!(await validateNewBookingData(newBookingData));

    if (!isValidData) {
      const errorMessage = "Impossible to create a booking - Invalid data";
      logger.error(errorMessage);
      ctx.status = 400;
      ctx.message = errorMessage;
      return;
    }

    const serializedBooking = serializeBookingForDBInsert(newBookingData);

    const newBookingId = await insertOneBooking(serializedBooking);

    const successMessage = "New booking created";
    logger.info(successMessage, {
      accountId: accountId,
      bookingId: newBookingId,
    });
    ctx.status = 201;
    ctx.message = successMessage;
    ctx.body = {
      bookingId: newBookingId,
    };
  } catch (error) {
    const errorMessage = "Error while creating a booking";

    logger.error(errorMessage, {
      accountId: accountId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getAccountBookings = async (ctx: Context) => {
  const { accountId } = ctx.state;
  try {
    const bookings = await retrieveBookingsByAccountId(accountId);

    const serializedBookings = bookings.map(serializeBookingForClient);

    ctx.status = 200;
    ctx.body = { bookings: serializedBookings };
  } catch (error) {
    const errorMessage = "Error while retrieving bookings by interval";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getAccountBooking = async (ctx: Context) => {
  const { bookingId } = ctx.params;
  const { booking } = ctx.state;
  try {
    const serializedBooking = serializeBookingForClient(booking);

    ctx.status = 200;
    ctx.message = "Booking retrieved";
    ctx.body = { serializedBooking };
  } catch (error) {
    const errorMessage = "Error while retrieving a booking";

    logger.error(errorMessage, {
      bookingId: bookingId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getHouseBooking = async (ctx: Context) => {
  const { bookingId } = ctx.params;
  try {
    const booking = await retrieveBookingById(bookingId);

    const serializedBooking = serializeBookingForClient(booking);

    ctx.status = 200;
    ctx.message = "Booking retrieved";
    ctx.body = { serializedBooking };
  } catch (error) {
    const errorMessage = "Error while retrieving a booking";

    logger.error(errorMessage, {
      bookingId: bookingId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getHouseBookingsByInterval = async (ctx: Context) => {
  const { houseId } = ctx.params;
  const { start, end } = ctx.query;

  try {
    if (!start || !end) {
      const errorMessage = "Could not find query parameters";
      logger.error(errorMessage);
      ctx.status = 404;
      ctx.message = errorMessage;
    }

    const formattedStart = format(new Date(start), "y/MM/dd");

    const formattedEnd = format(new Date(end), "y/MM/dd");

    const bookings = await retrieveHouseBookingsByInterval(
      formattedStart,
      formattedEnd,
      houseId,
    );

    const serializedBookings = bookings.map(serializeBookingForClient);

    ctx.status = 200;
    ctx.body = { bookings: serializedBookings };
  } catch (error) {
    const errorMessage = "Error while retrieving bookings by interval";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const updateBooking = async (ctx: Context) => {
  const { accountId, booking } = ctx.state;
  const { arrivalTime, departureTime, comments, companions } = ctx.request.body;

  try {
    const bookingToBeUpdated = booking;

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

      await updateBookingById(bookingToBeUpdated.booking_id, serializedBooking);

      const successMessage = "Booking updated";
      logger.info(successMessage, {
        accountId: accountId,
        bookingId: bookingToBeUpdated.bookingId,
      });
      ctx.status = 200;
      ctx.message = successMessage;
      return;
    }

    const bookingDataToUpdate: UpdatedBookingProperties = {
      comments,
      companions,
    };

    const serializedBooking = serializeBookingForDBUpdate(bookingDataToUpdate);

    await updateBookingById(bookingToBeUpdated.booking_id, serializedBooking);

    const successMessage = "Booking updated";
    logger.info(successMessage, {
      accountId: accountId,
      bookingId: bookingToBeUpdated.bookingId,
    });
    ctx.status = 200;
    ctx.message = successMessage;
  } catch (error) {
    const errorMessage = "Error while updating a booking";

    logger.error(errorMessage, {
      bookingId: booking.bookingId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
