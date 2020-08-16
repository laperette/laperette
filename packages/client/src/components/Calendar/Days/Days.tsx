import React from "react";
import { Cell } from "../Cell/Cell";
import { Booking } from "../Calendar";
import { isWithinInterval } from "date-fns";

interface Props {
  daysToDisplay: Date[];
  currentMonthName: string;
  bookings: Booking[];
}

export const Days = ({ daysToDisplay, currentMonthName, bookings }: Props) => {
  return (
    <React.Fragment>
      {daysToDisplay.map((day, index) => {
        const booking = bookings.find((booking) =>
          isWithinInterval(day, booking.interval),
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
    </React.Fragment>
  );
};
