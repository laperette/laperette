import useSWR from "swr";
import { Booking } from "../types";
import { serializeBooking } from "../utils/bookings";
import { fetcher } from "../utils/fetcher";

export const useBookings = () =>
  useSWR<Booking[] | null>("/bookings", {
    fetcher: (url) =>
      fetcher(url).then((data) => data.bookings.map(serializeBooking)),
  });
