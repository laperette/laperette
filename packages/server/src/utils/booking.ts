import { validateAccountId } from "./account";
import { isSameDay, parseJSON } from "date-fns";
import {
  NewBookingProperties,
  BookingStatus,
  BookingForClient,
  BookingFromDB,
  BookingForDBInsert,
  UpdatedBookingProperties,
  BookingForDBUpdate,
} from "../types/bookings";
import { logger } from "../logger";

export const validateNewBookingData = async (
  newBookingData: NewBookingProperties,
): Promise<boolean> => {
  const {
    accountId,
    arrivalTime,
    departureTime,
    comments,
    companions,
  } = newBookingData;

  const isAccounValid = !!(await validateAccountId(accountId));

  if (!isAccounValid) {
    logger.error("Invalid account id", {
      accountId: accountId,
    });
    return false;
  }

  const isArrivalTimeValid = !!validateArrivalTime(arrivalTime);

  if (!isArrivalTimeValid) {
    logger.error("Invalid arrival time", {
      accountId: accountId,
      arrivalTime: arrivalTime,
    });
    return false;
  }

  const isDepartureTimeValid = !!validateDepartureTime(
    departureTime,
    arrivalTime,
  );

  if (!isDepartureTimeValid) {
    logger.error("Invalid departure time", {
      accountId: accountId,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
    });
    return false;
  }

  const isValidComments = !!validateComments(comments);

  if (!isValidComments) {
    logger.error("Invalid comments", {
      accountId: accountId,
      comments: comments,
    });
    return false;
  }

  const isValidCompanions = !!validateCompanions(companions);

  if (!isValidCompanions) {
    logger.error("Invalid companions", {
      accountId: accountId,
      companions: companions,
    });
    return false;
  }

  return true;
};

const validateArrivalTime = (
  arrivalTime: NewBookingProperties["arrivalTime"],
): boolean => {
  const parsedArrivalTime = Date.parse(arrivalTime);
  if (isNaN(parsedArrivalTime)) {
    return false;
  }

  if (parsedArrivalTime < new Date(Date.now()).getTime()) {
    return false;
  }

  return true;
};

const validateDepartureTime = (
  departureTime: NewBookingProperties["departureTime"],
  arrivalTime: NewBookingProperties["arrivalTime"],
): boolean => {
  const parsedArrivalTime = Date.parse(arrivalTime);
  const parsedDepartureTime = Date.parse(departureTime);

  if (isNaN(parsedDepartureTime)) {
    return false;
  }
  if (parsedDepartureTime < parsedArrivalTime) {
    return false;
  }

  return true;
};

const validateComments = (
  comments: NewBookingProperties["comments"],
): boolean => {
  if (typeof comments !== "string") {
    return false;
  }

  if (comments.length >= 200) {
    return false;
  }

  return true;
};

const validateCompanions = (
  companions: NewBookingProperties["companions"],
): boolean => {
  if (companions.constructor !== Array) {
    return false;
  }

  if (!companions.every((companion) => typeof companion === "string")) {
    return false;
  }

  return true;
};

export const haveBookingDatesChanged = (
  bookingToBeUpdated: BookingFromDB,
  departureTime: string,
  arrivalTime: string,
): boolean => {
  if (!departureTime && !arrivalTime) {
    return false;
  }

  if (
    !isSameDay(new Date(departureTime), bookingToBeUpdated.departure_time) ||
    !isSameDay(new Date(arrivalTime), bookingToBeUpdated.arrival_time)
  ) {
    return true;
  }

  return false;
};

export const serializeBookingForDBInsert = (
  bookingProperties: NewBookingProperties,
): BookingForDBInsert => ({
  booker_id: bookingProperties.accountId,
  arrival_time: parseJSON(bookingProperties.arrivalTime),
  departure_time: parseJSON(bookingProperties.departureTime),
  comments: bookingProperties.comments,
  companions: bookingProperties.companions,
  status: "pending" as BookingStatus,
});

export const serializeBookingForDBUpdate = (
  bookingProperties: UpdatedBookingProperties,
): BookingForDBUpdate => ({
  arrival_time: parseJSON(bookingProperties.arrivalTime),
  departure_time: parseJSON(bookingProperties.departureTime),
  comments: bookingProperties.comments,
  companions: bookingProperties.companions,
  status: "pending" as BookingStatus,
});

export const serializeBookingForClient = (
  booking: BookingFromDB,
): BookingForClient => ({
  bookingId: booking.booking_id,
  firstName: booking.first_name,
  lastName: booking.last_name,
  arrivalTime: booking.arrival_time,
  departureTime: booking.departure_time,
  status: booking.status,
  comments: booking.comments,
  companions: booking.companions,
});
