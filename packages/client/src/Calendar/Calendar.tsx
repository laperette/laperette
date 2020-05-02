import React, { useState } from "react";
import { Box, Button, Grid, Heading } from "grommet";
import { Next, Previous } from "grommet-icons";

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
  parseISO,
  setYear,
} from "date-fns";
import { repeat, zeros } from "../utils";

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
  readonly end_date: string;
  readonly name: string;
  readonly start_date: string;
  readonly surname: string;
};

export const Calendar = ({
  bookings,
}: {
  bookings: ReadonlyArray<Booking>;
}) => {
  const today = new Date();
  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions({ date: today });
  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const monthDate = setYear(setMonth(today, currentMonthNumber), currentYear);
  const daysInMonth = [];
  for (let d = 1; d <= getDaysInMonth(monthDate); d++) {
    const day = setDate(monthDate, d);
    const booking = bookings.find((booking) =>
      isWithinInterval(day, {
        start: parseISO(booking.start_date),
        end: parseISO(booking.end_date),
      }),
    );
    daysInMonth.push(<Day key={d} day={day} booking={booking} />);
  }

  return (
    <Grid
      fill
      columns={repeat(7, "1fr")}
      rows={["xxsmall", "xxsmall", ...repeat(6, "auto")]}
      gap="small"
      areas={[
        repeat(7, "header"),
        WEEK_DAYS_NAMES,
        ...zeros(6).map((_, row) =>
          zeros(7).map((_, col) => `day-${row * 7 + col + 1}`),
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

const Day = ({ day, booking }: { day: Date; booking?: Booking }) => {
  const date = getDate(day);
  const dayNumber = date + (getDay(startOfMonth(day)) || 7) - 1;
  return (
    <Box border="all" gridArea={`day-${dayNumber}`} key={date}>
      {date}
      {booking && booking.name}
    </Box>
  );
};
