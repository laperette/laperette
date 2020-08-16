import React from "react";
import { Cell } from "../Cell/Cell";
import { Booking } from "../Calendar";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface Props {
  daysToDisplay: Date[];
  currentMonthName: string;
  bookings: Booking[];
}

export const Days = ({ daysToDisplay, currentMonthName, bookings }: Props) => {
  return (
    <>
      {daysToDisplay.map((day, index) => {
        const booking = bookings.find((booking) =>
          isWithinInterval(day, {
            start: startOfDay(booking.arrivalTime),
            end: endOfDay(booking.departureTime),
          }),
        );
        return (
          <Cell
            booking={booking}
            day={day}
            dayNumber={index + 1}
            key={day.toISOString()}
            currentMonth={currentMonthName}
          />
        );
      })}
    </>
  );
};
