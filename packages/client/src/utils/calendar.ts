import { Booking } from "../components/Calendar/Calendar";
import { parseISO } from "date-fns";

export const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  interval: {
    start: parseISO(rawBooking.arrival_time),
    end: parseISO(rawBooking.departure_time),
  },
  name: rawBooking.first_name,
});

export const getRandomIntegerInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};