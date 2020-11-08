import { Box, Chip, Typography } from "@material-ui/core";
import { getDate, getMonth, isSameDay } from "date-fns";
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
    <Box key={date} padding={1} bgcolor="rgb(245, 245, 245)" width="100%">
      <Typography
        id={`${dayNumber}-${day.toString()}`}
        color={month === currentMonth ? "textPrimary" : "textSecondary"}
        align="right"
        data-testid="day-text"
        style={{
          textDecoration: isSameDay(day, today) ? "underline" : "none",
        }}
      >
        {date === 1 ? `${date}st` : date}
      </Typography>
      {booking && (
        <Chip
          label={`${booking.firstName[0]} ${booking.lastName[0]}`}
          onClick={() => setSelectedBooking(booking)}
        />
      )}
    </Box>
  );
};
