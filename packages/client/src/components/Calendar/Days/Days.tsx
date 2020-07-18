import React from "react";
import { Cell } from "../Cell/Cell";

interface Props {
  daysToDisplay: Date[];
  currentMonthName: string;
}

export const Days = ({ daysToDisplay, currentMonthName }: Props) => {
  return (
    <React.Fragment>
      {daysToDisplay.map((day, index) => {
        // const booking = bookings.find((booking) =>
        //   isWithinInterval(day, booking.interval),
        // );
        return (
          <Cell
            // booking={booking}
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
