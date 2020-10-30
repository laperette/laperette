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
  const dayColor = isSameDay(day, today) ? "brand" : "light-3";

  return (
    <Box border={{ side: "all", color: dayColor }} key={date} pad="xxsmall">
      <Text
        id={`${dayNumber}-${day.toString()}`}
        color={month === currentMonth ? "dark-1" : "dark-4"}
        size={date === 1 ? "large" : "medium"}
        textAlign="end"
        data-testid="day-text"
      >
        {date === 1 ? `${date} ${month}` : date}
      </Text>

      {booking && (
        <Box
          background={booking.status === "pending" ? "light-3" : "dark-4"}
          onClick={() => setSelectedBooking(booking)}
          pad="xxsmall"
        >
          <Text size="small">
            {booking.firstName} {booking.lastName}
          </Text>
        </Box>
      )}
    </Box>
  );
};
