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
