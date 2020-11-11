import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";

import { Booking, NewBookingBody, NewBookingData } from "../types";
import { serializeBooking } from "../utils/bookings";
import { createNewDateFromString } from "../utils/calendar";
import { useAuth } from "../contexts/AuthContext";
import { fetcher, getAxiosInstance } from "../utils/fetcher";

export const useBookings = ({
  revalidateOnMount = true,
}: {
  revalidateOnMount?: boolean;
} = {}) => {
  const { user } = useAuth();
  const bookingsEndpoint = `/bookings`;
  const { data: bookings, error, mutate, revalidate } = useSWR<
    Booking[],
    AxiosError
  >(bookingsEndpoint, {
    fetcher: (url) =>
      fetcher(url).then(({ bookings }) => bookings.map(serializeBooking)),
    initialData: [],
    revalidateOnMount,
  });

  const cancelBooking = async (bookingId: string) =>
    getAxiosInstance().delete(`/bookings/${bookingId}`);

  const createBooking = async (newBookingData: NewBookingBody) =>
    getAxiosInstance().post(
      `/houses/${newBookingData.houseId}/bookings/booking`,
      newBookingData,
    );

  const handleBookingCancellation = async (
    bookingId: string,
  ): Promise<void> => {
    const newBookingList = bookings?.filter(
      (booking) => booking.bookingId !== bookingId,
    );
    await mutate(newBookingList, false);
    await cancelBooking(bookingId);
    await revalidate();
  };

  const handleBookingCreation = async (newBookingData: NewBookingData) => {
    const newBookingBody: NewBookingBody = {
      houseId: newBookingData.houseId,
      arrivalTime: createNewDateFromString(newBookingData.arrivalTime),
      departureTime: createNewDateFromString(newBookingData.departureTime),
      comments: newBookingData.comments,
      companions: parseInt(newBookingData.companions, 10),
    };

    const temporaryBookingId = uuidv4();

    const newBooking = {
      ...newBookingBody,
      bookingId: temporaryBookingId,
      status: "pending",
      firstName: user?.firstName || "User",
      lastName: user?.lastName || "User",
    };

    let newBookingList;
    if (bookings) {
      newBookingList = [...bookings, newBooking];
    } else {
      newBookingList = [newBooking];
    }

    await mutate(newBookingList, false);
    await createBooking(newBookingBody);
    await revalidate();
  };

  return { bookings, error, handleBookingCancellation, handleBookingCreation };
};
