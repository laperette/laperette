import { useState } from "react";
import {
  getMonth,
  getYear,
  setYear,
  startOfMonth,
  setMonth,
  endOfMonth,
  getDay,
  subDays,
  getDaysInMonth,
  setDate,
  addDays,
} from "date-fns";
import { MONTHS_NAMES } from "../utils/constants";
import { rangeRight, range } from "lodash";

export const useCalendarActions = () => {
  const today = new Date(); // setHours(new Date(), 2);

  const [currentMonthNumber, setCurrentMonthNumber] = useState(getMonth(today));
  const [currentYear, setCurrentYear] = useState(getYear(today));

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
    setCurrentMonthNumber(getMonth(today));
    setCurrentYear(getYear(today));
  };

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

  return {
    previousMonthDays,
    currentMonthDays,
    nextMonthDays,
    currentMonthName,
    decrementMonth,
    incrementMonth,
    resetToDate,
  };
};
