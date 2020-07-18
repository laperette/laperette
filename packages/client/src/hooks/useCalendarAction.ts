import { useState } from "react";
import { getMonth, getYear } from "date-fns";

export const useCalendarActions = () => {
  const date = new Date();

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
