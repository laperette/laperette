import { validateAccountId } from "./account";
import { isSameDay } from "date-fns";
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
import { isUuid } from "./regexp";

export const validateNewBookingData = async (
  newBookingData: NewBookingProperties,
): Promise<boolean> => {
  const {
    accountId,
    bookingId,
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

  const isBookingIdValid = !!validateBookingId(bookingId);

  if (!isBookingIdValid) {
    logger.error("Invalid booking id", {
      accountId: accountId,
      bookingId: bookingId,
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

export const validateUpdatedBookingData = (
  updatedBookingData: UpdatedBookingProperties,
) => {
  const {
    arrivalTime,
    departureTime,
    comments,
    companions,
  } = updatedBookingData;

  if (arrivalTime) {
    const isArrivalTimeValid = !!validateArrivalTime(arrivalTime);

    if (!isArrivalTimeValid) {
      logger.error("Invalid arrival time", {
        arrivalTime: arrivalTime,
      });
      return false;
    }
  }

  if (departureTime) {
    const isDepartureTimeValid = !!validateDepartureTime(
      departureTime,
      arrivalTime,
    );

    if (!isDepartureTimeValid) {
      logger.error("Invalid departure time", {
        arrivalTime: arrivalTime,
        departureTime: departureTime,
      });
      return false;
    }
  }

  const isValidComments = !!validateComments(comments);

  if (!isValidComments) {
    logger.error("Invalid comments", {
      comments: comments,
    });
    return false;
  }

  const isValidCompanions = !!validateCompanions(companions);

  if (!isValidCompanions) {
    logger.error("Invalid companions", {
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
  if (typeof companions === "number") {
    return true;
  }

  if (
    typeof companions === "string" &&
    typeof parseInt(companions, 10) === "number"
  ) {
    return true;
  }

  return false;
};

const validateBookingId = (bookingId: string) => {
  /**
   * Reflection needed over houseId uniqueness validation since houseId uuid is client generated.
   * Possibility to query DB to check uuid not in DB yet but would impact perfomance
   */

  if (isUuid(bookingId)) {
    return true;
  }

  return false;
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
  booking_id: bookingProperties.bookingId,
  arrival_time: bookingProperties.arrivalTime,
  departure_time: bookingProperties.departureTime,
  comments: bookingProperties.comments,
  companions: parseInt(bookingProperties.companions, 10),
  status: "pending" as BookingStatus,
  house_id: bookingProperties.houseId,
});

export const serializeBookingForDBUpdate = (
  bookingProperties: UpdatedBookingProperties,
): BookingForDBUpdate => ({
  arrival_time: bookingProperties.arrivalTime,
  departure_time: bookingProperties.departureTime,
  comments: bookingProperties.comments,
  companions: parseInt(bookingProperties.companions, 10),
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
  houseId: booking.house_id,
  houseName: booking.name,
});
