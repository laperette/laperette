import { Context } from "koa";
import { retrieveBookingById } from "../db/bookings";
import { logger } from "../logger";

export const validateBookingOwnership = async (
  ctx: Context,
  next: () => void,
) => {
  const { bookingId } = ctx.params;
  const { accountId } = ctx.state;

  if (!bookingId) {
    ctx.status = 400;
    ctx.message = "Invalid booking id";
    return;
  }

  const booking = await retrieveBookingById(bookingId);

  if (!booking) {
    const errorMessage = "Booking not found";
    logger.error(errorMessage);
    ctx.status = 404;
    ctx.message = errorMessage;
    return;
  }

  if (accountId !== booking.booker_id) {
    const errorMessage =
      "Impossible to return this booking - Invalid booking owner";
    logger.error(errorMessage);
    ctx.status = 403;
    ctx.message = errorMessage;
    return;
  }

  ctx.state.booking = booking;

  return next();
};
