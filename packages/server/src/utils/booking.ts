import { validateAccountId } from "./account";
import { insertNewBooking, BookingStatus } from "../db/bookings";

interface NewBookingData {
  accountId: string;
  arrivalTime: string;
  departureTime: string;
  comments: string;
  companions: string[];
}

interface VerifiedNewBookingData {
  accountId: string;
  arrivalTime: Date;
  departureTime: Date;
  comments: string;
  companions: string[];
}
export const createNewBooking = async (
  newBookingData: VerifiedNewBookingData,
) => {
  const formattedBooking = {
    booker_id: newBookingData.accountId,
    arrival_time: newBookingData.arrivalTime,
    departure_time: newBookingData.departureTime,
    comments: newBookingData.comments,
    companions: newBookingData.companions,
    booking_status: "pending" as BookingStatus,
  };

  await insertNewBooking(formattedBooking);
};

export const validateNewBookingData = async (
  newBookingData: NewBookingData,
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
    console.log("Invalid account id");
    return false;
  }

  const isArrivalTimeValid = !!validateArrivalTime(arrivalTime);

  if (!isArrivalTimeValid) {
    console.log("Invalid arrival time");
    return false;
  }

  const isDepartureTimeValid = !!validateDepartureTime(
    departureTime,
    arrivalTime,
  );

  if (!isDepartureTimeValid) {
    console.log("Invalid departure time");
    return false;
  }

  const isValidComments = !!validateComments(comments);

  if (!isValidComments) {
    console.log("Invalid comments");
    return false;
  }

  const isValidCompanions = !!validateCompanions(companions);

  if (!isValidCompanions) {
    console.log("Invalid companions");
    return false;
  }

  return true;
};

const validateArrivalTime = (
  arrivalTime: NewBookingData["arrivalTime"],
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
  departureTime: NewBookingData["departureTime"],
  arrivalTime: NewBookingData["arrivalTime"],
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

const validateComments = (comments: NewBookingData["comments"]): boolean => {
  if (typeof comments !== "string") {
    return false;
  }

  if (comments.length >= 200) {
    return false;
  }

  return true;
};

const validateCompanions = (
  companions: NewBookingData["companions"],
): boolean => {
  if (companions.constructor !== Array) {
    return false;
  }

  if (!companions.every((companion) => typeof companion === "string")) {
    return false;
  }

  return true;
};
