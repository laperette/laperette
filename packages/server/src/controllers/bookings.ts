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
import { logger, sanitizeError } from "../logger";

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

export const getBooking = async (ctx: Context) => {
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

export const getBookingsByInterval = async (ctx: Context) => {
  try {
    const { start, end } = ctx.query;

    if (!start || !end) {
      const errorMessage = "Could not find query parameters";
      logger.error(errorMessage);
      ctx.status = 404;
      ctx.message = errorMessage;
    }

    const formattedStart = format(new Date(start), "y/MM/dd");

    const formattedEnd = format(new Date(end), "y/MM/dd");

    const bookings = await retrieveBookingsByInterval(
      formattedStart,
      formattedEnd,
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

export const getBookings = async (ctx: Context) => {
  try {
    const bookings = await retrieveAllBookings();

    const serializedBookings = bookings.map(serializeBookingForClient);

    ctx.status = 200;
    ctx.body = { bookings: serializedBookings };
  } catch (error) {
    const errorMessage = "Error while retrieving all bookings";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const updateBooking = async (ctx: Context) => {
  const { accountId, bookingId } = ctx.params;

  const { arrivalTime, departureTime, comments, companions } = ctx.request.body;

  try {
    const bookingToBeUpdated = await retrieveBookingById(bookingId);

    if (accountId !== bookingToBeUpdated.booker_id) {
      const errorMessage =
        "Impossible to update this booking - Invalid booking owner";
      logger.error(errorMessage);
      ctx.status = 403;
      ctx.message = errorMessage;
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

      const successMessage = "Booking updated";
      logger.info(successMessage, {
        accountId: accountId,
        bookingId: bookingId,
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

    await updateBookingById(bookingId, serializedBooking);

    const successMessage = "Booking updated";
    logger.info(successMessage, {
      accountId: accountId,
      bookingId: bookingId,
    });
    ctx.status = 200;
    ctx.message = successMessage;
  } catch (error) {
    const errorMessage = "Error while updating a booking";

    logger.error(errorMessage, {
      bookingId: bookingId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
