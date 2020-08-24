import { Booking } from "../components/Calendar/Calendar";
import { parseISO } from "date-fns";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  arrivalTime: parseISO(rawBooking.arrivalTime),
  departureTime: parseISO(rawBooking.departureTime),
  firstName: rawBooking.firstName,
  lastName: rawBooking.lastName,
  bookingId: rawBooking.bookingId,
  status: rawBooking.status,
  comments: rawBooking.comments,
  companions: rawBooking.companions,
});
