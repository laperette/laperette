import { parseISO } from "date-fns";
import { Booking } from "../types";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  arrivalTime: parseISO(rawBooking.arrivalTime),
  departureTime: parseISO(rawBooking.departureTime),
  firstName: rawBooking.firstName,
  lastName: rawBooking.lastName,
  bookingId: rawBooking.bookingId,
  status: rawBooking.status,
  comments: rawBooking.comments,
  companions: rawBooking.companions,
  houseName: rawBooking.houseName,
});

export const newBookingFieldsErrorsMapping: { [key: string]: string } = {
  "generalInvalidMessage": "This field might be wrong",
  "required": "This field can't be empty",
  "wrongHouseName": "This house name is incorrect",
  "wrongComments": "This comment is invalid",
  "wrongNumberOfPeople": "This number of people is invalid",
  "wrongArrivalTime": "This arrival date is incorrect",
  "departureTime": "This departure date is incorrect",
};
