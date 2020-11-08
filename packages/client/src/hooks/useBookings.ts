import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";

import { Booking, NewBookingBody, NewBookingData } from "../types";
import { serializeBooking } from "../utils/bookings";
import { createNewDateFromString } from "../utils/calendar";
import { useAuth } from "../contexts/AuthContext";

export const useBookings = () => {
  const { user } = useAuth();
  const bookingsEndpoint = `${process.env.REACT_APP_SERVER_URL}/bookings`;

  const getBookings = async (): Promise<Booking[]> => {
    const response = await Axios.get(bookingsEndpoint, {
      withCredentials: true,
    });

    return response.data.bookings.map(serializeBooking);
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    await Axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/bookings/${bookingId}`,
      {
        withCredentials: true,
      },
    );
  };

  const createBooking = async (newBookingData: NewBookingBody) => {
    await Axios(
      `${process.env.REACT_APP_SERVER_URL}/houses/${newBookingData.houseId}/bookings/booking`,
      {
        method: "post",
        data: newBookingData,
        withCredentials: true,
      },
    );
  };

  const { data: bookings, error, mutate, revalidate } = useSWR<Booking[]>(
    bookingsEndpoint,
    getBookings,
  );

  const handleBookingCancellation = async (
    bookingId: string,
  ): Promise<void> => {
    const newBookingList = bookings?.filter(
      (booking) => booking.bookingId !== bookingId,
    );

    await cancelBooking(bookingId);

    await mutate(newBookingList);
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

    await createBooking(newBookingBody);

    await mutate(newBookingList, false);
    await revalidate();
  };

  return { bookings, error, handleBookingCancellation, handleBookingCreation };
};
