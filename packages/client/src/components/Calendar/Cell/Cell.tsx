import { Booking } from "..";
import {
  getDate,
  getMonth,
  isSameDay,
  eachDayOfInterval,
  format,
} from "date-fns";
import { Box, Text } from "grommet";
import React from "react";
import { MONTHS_NAMES } from "../../../utils/constants";

export const Cell = ({
  day,
  booking,
  dayNumber,
  currentMonth,
}: {
  day: Date;
  booking?: Booking;
  dayNumber: number;
  currentMonth: string;
}) => {
  const today = new Date();
  const date = getDate(day);
  const month = MONTHS_NAMES[getMonth(day)];
  const dayColor = isSameDay(day, today) ? "brand" : "light-3";
  const DATE_FORMAT = "dd/MM/yyyy 'à' H 'heures'";
  return (
    <Box
      border={{ side: "all", color: dayColor }}
      gridArea={`day-${dayNumber}`}
      key={date}
      pad="xxsmall"
    >
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
          background="light-3"
          hoverIndicator
          onClick={() => {
            alert(
              `${booking.firstName} ${booking.lastName} a réservé pour ${
                eachDayOfInterval(booking.interval).length
              } jours, du ${format(
                booking.interval.start,
                DATE_FORMAT,
              )} au ${format(booking.interval.end, DATE_FORMAT)}`,
            );
          }}
          pad="xxsmall"
        >
          <Text size="small">
            ${booking.firstName} ${booking.lastName}
          </Text>
        </Box>
      )}
    </Box>
  );
};
