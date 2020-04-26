import React, { useState } from "react";
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
import styled from "styled-components";

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

  return {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
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
  } = useCalendarActions({ date: today });
  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const weekDays = WEEK_DAYS_NAMES.map((day) => {
    return (
      <WeekDay key={day} weekDay={day}>
        {day}
      </WeekDay>
    );
  });

  const monthDate = setYear(setMonth(today, currentMonthNumber), currentYear);
  const daysInMonth = [];
  for (let d = 1; d <= getDaysInMonth(monthDate); d++) {
    const day = setDate(monthDate, d);
    const booking = bookings.find((booking) => {
      console.log(booking, day);

      return isWithinInterval(day, {
        start: parseISO(booking.start_date),
        end: parseISO(booking.end_date),
      });
    });
    daysInMonth.push(<Day key={d} day={day} booking={booking} />);
  }

  return (
    <Container>
      <Header>
        {currentYear}
        <button onClick={decrementMonth}>Previous</button>
        {currentMonthName}
        <button onClick={incrementMonth}>Next</button>
      </Header>
      {weekDays}
      {daysInMonth.map((d, i) => d)}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 24px 24px repeat(6, auto);
  grid-template-areas:
    "header header header header header header header"
    "Lundi Mardi Mercredi Jeudi Vendredi Samedi Dimanche"
    "day-1 day-2 day-3 day-4 day-5 day-6 day-7"
    "day-8 day-9 day-10 day-11 day-12 day-13 day-14"
    "day-15 day-16 day-17 day-18 day-19 day-20 day-21"
    "day-22 day-23 day-24 day-25 day-26 day-27 day-28"
    "day-29 day-30 day-31 day-32 day-33 day-34 day-35"
    "day-36 day-37 day-38 day-39 day-40 day-41 day-42";
  column-gap: 8px;
  row-gap: 8px;
`;

const WeekDay = styled.div<{ weekDay: string }>`
  font-weight: bold;
  align-self: center;
  text-align: center;
  grid-area: ${({ weekDay }) => weekDay};
`;

const StyledDay = styled.div<{ day: string }>`
  grid-area: ${({ day }) => day};
  border: 1px solid black;
`;

const Header = styled.div`
  grid-area: header;
  display: flex;
  align-self: center;
  justify-content: space-around;
`;

const Day = ({ day, booking }: { day: Date; booking?: Booking }) => {
  const date = getDate(day);
  const dayNumber = date + (getDay(startOfMonth(day)) || 7) - 1;
  return (
    <StyledDay day={`day-${dayNumber}`} key={date}>
      {date}
      {booking && booking.name}
    </StyledDay>
  );
};
