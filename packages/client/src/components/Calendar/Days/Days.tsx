import React from "react";
import { Cell } from "../Cell/Cell";

interface Props {
  previousMonthDays: Date[];
  currentMonthDays: Date[];
  nextMonthDays: Date[];
  currentMonthName: string;
}

export const Days = ({
  previousMonthDays,
  currentMonthDays,
  nextMonthDays,
  currentMonthName,
}: Props) => {
  const daysInMonth = [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays,
  ];

  return (
    <React.Fragment>
      {daysInMonth.map((day, index) => {
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
