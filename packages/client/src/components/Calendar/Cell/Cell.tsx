import { getDate, getMonth, isSameDay } from "date-fns";
import { Box, Text } from "grommet";
import React from "react";
import { Booking } from "../../../types";
import { MONTHS_NAMES } from "../../../utils/constants";
interface Props {
  day: Date;
  booking?: Booking;
  dayNumber: number;
  currentMonth: string;
  setSelectedBooking: (booking: Booking) => void;
}

export const Cell = ({
  day,
  booking,
  dayNumber,
  currentMonth,
  setSelectedBooking,
}: Props) => {
  const today = new Date();
  const date = getDate(day);
  const month = MONTHS_NAMES[getMonth(day)];

  return (
    <Box border={{ side: "all", color: "light-3" }} key={date} pad="xxsmall">
      <Text
        id={`${dayNumber}-${day.toString()}`}
        color={month === currentMonth ? "dark-1" : "dark-4"}
        size="medium"
        textAlign="end"
        data-testid="day-text"
        style={{
          textDecoration: isSameDay(day, today) ? "underline" : "none",
          WebkittextUnderlinePosition: "2px",
          textDecorationColor: "light-3",
        }}
      >
        {date === 1 ? `${date}st` : date}
      </Text>

      {booking && (
        <Box
          background={booking.status === "pending" ? "light-3" : "dark-4"}
          onClick={() => setSelectedBooking(booking)}
          pad="xxxsmall"
          round="xlarge"
          fill="horizontal"
        >
          <Text
            size="small"
            margin={{
              "left": "5px",
            }}
          >
            {booking.firstName[0]} {booking.lastName[0]}
          </Text>
        </Box>
      )}
    </Box>
  );
};
