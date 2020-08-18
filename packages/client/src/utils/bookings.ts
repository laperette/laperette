import { Booking } from "../components/Calendar/Calendar";
import { parseISO } from "date-fns";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  arrivalTime: parseISO(rawBooking.arrival_time),
  departureTime: parseISO(rawBooking.departure_time),
  firstName: rawBooking.first_name,
  lastName: rawBooking.last_name,
  bookingId: rawBooking.booking_id,
  status: rawBooking.status,
  comments: rawBooking.comments,
  companions: rawBooking.companions,
});
