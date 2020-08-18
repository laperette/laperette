import { Booking } from "../components/Calendar/Calendar";
import { parseISO } from "date-fns";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  interval: {
    start: parseISO(rawBooking.arrival_time),
    end: parseISO(rawBooking.departure_time),
  },
  firstName: rawBooking.first_name,
  lastName: rawBooking.last_name,
  bookingId: rawBooking.booking_id,
  bookingStatus: rawBooking.booking_status,
  comments: rawBooking.comments,
  companions: rawBooking.companions,
});
