import React from "react";
import { Cell } from "../Cell/Cell";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Booking } from "../../../types";

interface Props {
  daysToDisplay: Date[];
  currentMonthName: string;
  bookings?: Booking[];
  setSelectedBooking: (booking: Booking) => void;
}

export const Days = ({
  daysToDisplay,
  currentMonthName,
  bookings,
  setSelectedBooking,
}: Props) => {
  return (
    <>
      {daysToDisplay.map((day, index) => {
        const booking =
          bookings?.find((booking) =>
            isWithinInterval(day, {
              start: startOfDay(new Date(booking.arrivalTime)),
              end: endOfDay(new Date(booking.departureTime)),
            }),
          ) || undefined;

        return (
          <Cell
            booking={booking}
            day={day}
            dayNumber={index + 1}
            key={day.toISOString()}
            currentMonth={currentMonthName}
            setSelectedBooking={setSelectedBooking}
          />
        );
      })}
    </>
  );
};
