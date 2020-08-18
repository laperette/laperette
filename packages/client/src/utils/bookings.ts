import { Booking } from "../components/Calendar/Calendar";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  arrivalTime: rawBooking.arrival_time,
  departureTime: rawBooking.departure_time,
  firstName: rawBooking.first_name,
  lastName: rawBooking.last_name,
  bookingId: rawBooking.booking_id,
  status: rawBooking.status,
  comments: rawBooking.comments,
  companions: rawBooking.companions,
});
