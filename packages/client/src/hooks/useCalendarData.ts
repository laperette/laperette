import {
  setYear,
  setMonth,
  startOfMonth,
  endOfMonth,
  getDay,
  subDays,
  getDaysInMonth,
  setDate,
  addDays,
} from "date-fns";
import { rangeRight, range } from "lodash";

interface CalendarState {
  currentMonthNumber: number;
  currentYear: number;
}

export const useCalendarData = ({
  currentMonthNumber,
  currentYear,
}: CalendarState) => {
  const randomDateInCurrentMonth = new Date(
    currentYear,
    currentMonthNumber,
    15,
  );

  const firstDayInMonth = startOfMonth(randomDateInCurrentMonth);
  const lastDayInMonth = endOfMonth(randomDateInCurrentMonth);

  const previousMonthDays = rangeRight(
    1,
    getDay(firstDayInMonth),
  ).map((dayNum) => subDays(firstDayInMonth, dayNum));

  const currentMonthDays = range(
    1,
    getDaysInMonth(randomDateInCurrentMonth) + 1,
  ).map((date) => setDate(randomDateInCurrentMonth, date));
  const nextMonthDays = range(
    1,
    42 - (previousMonthDays.length + currentMonthDays.length) + 1,
  ).map((dayNum) => addDays(lastDayInMonth, dayNum));

  return {
    previousMonthDays,
    currentMonthDays,
    nextMonthDays,
  };
};
