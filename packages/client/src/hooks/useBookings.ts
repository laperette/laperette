import { AxiosError } from "axios";
import useSWR from "swr";
import { Booking } from "../types";
import { serializeBooking } from "../utils/bookings";
import { fetcher } from "../utils/fetcher";

export const useBookings = () => {
  const { error, data, ...swrResult } = useSWR<Booking[] | null, AxiosError>(
    "/bookings",
    {
      fetcher: (url) =>
        fetcher(url).then((data) => data.bookings.map(serializeBooking)),
    },
  );
  if (error) {
    throw error;
  }
  return { bookings: data, ...swrResult };
};
