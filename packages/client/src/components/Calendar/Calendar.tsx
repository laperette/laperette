import React, { useState, useLayoutEffect } from "react";
import { Box, Button, Grid, Heading, Text } from "grommet";
import { Next, Previous } from "grommet-icons";
import rangeRight from "lodash/rangeRight";
import range from "lodash/range";
import Axios from "axios";

import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  setMonth,
  setDate,
  startOfMonth,
  getDate,
  isWithinInterval,
  setYear,
  endOfMonth,
  addDays,
  subDays,
  isSameDay,
  eachDayOfInterval,
  Interval,
  format,
  parseISO,
} from "date-fns";
import { repeat } from "../../utils";
import { useAsync } from "../../hooks/useAsync";
import { FullPageSpinner } from "../FullPageSpinner";
import { FullPageErrorFallback } from "../FullPageErrorCallback";

const WEEK_DAYS_NAMES = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const MONTHS_NAMES = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const useCalendarActions = ({ date }: { date: Date }) => {
  const [currentMonthNumber, setCurrentMonthNumber] = useState(getMonth(date));
  const [currentYear, setCurrentYear] = useState(getYear(date));

  const decrementMonth = () => {
    if (currentMonthNumber === 0) {
      setCurrentMonthNumber(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthNumber(currentMonthNumber - 1);
    }
  };

  const incrementMonth = () => {
    if (currentMonthNumber === 11) {
      setCurrentMonthNumber(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthNumber(currentMonthNumber + 1);
    }
  };

  const resetToDate = () => {
    setCurrentMonthNumber(getMonth(date));
    setCurrentYear(getYear(date));
  };

  return {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  };
};

export type Booking = {
  readonly name: string;
  readonly interval: Interval;
};

const serializeBooking = (rawBooking: Record<string, any>): Booking => ({
  interval: {
    start: parseISO(rawBooking.start_date),
    end: parseISO(rawBooking.end_date),
  },
  name: rawBooking.first_name,
});

export const Calendar = () => {
  const {
    data: bookings,
    run,
    isIdle,
    isLoading,
    isError,
    error,
  } = useAsync<ReadonlyArray<Booking> | null>();

  useLayoutEffect(() => {
    const getBookings = async (): Promise<ReadonlyArray<Booking>> => {
      const response = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookings`,
      );
      return response.data.map(serializeBooking);
    };
    run(getBookings());
  }, [run]);

  const today = new Date(); // setHours(new Date(), 2);
  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions({ date: today });

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isIdle || isLoading || !bookings) {
    return <FullPageSpinner />;
  }

  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const monthDate = setYear(setMonth(today, currentMonthNumber), currentYear);

  const firstDayInMonth = startOfMonth(monthDate);
  const lastDayInMonth = endOfMonth(monthDate);

  const previousMonthDays = rangeRight(
    1,
    getDay(firstDayInMonth),
  ).map((dayNum) => subDays(firstDayInMonth, dayNum));
  const currentMonthDays = range(1, getDaysInMonth(monthDate) + 1).map((date) =>
    setDate(monthDate, date),
  );
  const nextMonthDays = range(
    1,
    42 - (previousMonthDays.length + currentMonthDays.length) + 1,
  ).map((dayNum) => addDays(lastDayInMonth, dayNum));
  const daysInMonth = [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays,
  ].map((day, index) => {
    const booking = bookings.find((booking) =>
      isWithinInterval(day, booking.interval),
    );
    return (
      <Day
        booking={booking}
        day={day}
        dayNumber={index + 1}
        key={day.toISOString()}
        currentMonth={currentMonthName}
      />
    );
  });

  return (
    <Grid
      fill
      columns={repeat(7, "1fr")}
      rows={["xxsmall", "xxsmall", ...repeat(6, "1fr")]}
      gap={undefined}
      areas={[
        repeat(7, "header"),
        WEEK_DAYS_NAMES,
        ...range(6).map((_, row) =>
          range(7).map((_, col) => `day-${row * 7 + col + 1}`),
        ),
      ]}
    >
      <Box direction="row" justify="between" gridArea="header">
        <Heading level="3">
          {currentMonthName} {currentYear}
        </Heading>
        <Box direction="row" role="group">
          <Button
            primary
            label="Previous"
            icon={<Previous />}
            onClick={decrementMonth}
          ></Button>
          <Button primary label="Today" onClick={resetToDate}></Button>
          <Button
            primary
            label="Next"
            icon={<Next />}
            reverse
            onClick={incrementMonth}
          ></Button>
        </Box>
      </Box>
      {WEEK_DAYS_NAMES.map((name) => (
        <Box alignSelf="center" gridArea={name} key={name}>
          <Heading alignSelf="center" level="5">
            {name}
          </Heading>
        </Box>
      ))}
      {daysInMonth}
    </Grid>
  );
};

const Day = ({
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
        color={month === currentMonth ? "dark-1" : "dark-4"}
        size={date === 1 ? "large" : "medium"}
        textAlign="end"
      >
        {date === 1 ? `${date} ${month}` : date}
      </Text>
      {booking && (
        <Box
          background="light-3"
          hoverIndicator
          onClick={() => {
            alert(
              `${booking.name} a réservé pour ${
                eachDayOfInterval(booking.interval).length
              } jours, du ${format(
                booking.interval.start,
                DATE_FORMAT,
              )} au ${format(booking.interval.end, DATE_FORMAT)}`,
            );
          }}
          pad="xxsmall"
        >
          <Text size="small">{booking.name}</Text>
        </Box>
      )}
    </Box>
  );
};
