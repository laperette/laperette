import React, { useState } from "react";
import {
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  setMonth,
  startOfMonth,
} from "date-fns";

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

export const Calendar = () => {
  const today = new Date();
  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
  } = useCalendarActions({ date: today });
  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const weekDays = WEEK_DAYS_NAMES.map((day) => {
    return <th key={day}>{day}</th>;
  });

  const monthDate = setMonth(today, currentMonthNumber);
  const firstDayOfMonth = startOfMonth(monthDate);
  const blanks = [];
  for (let i = 0; i < getDay(firstDayOfMonth) - 1; i++) {
    blanks.push(<td>{""}</td>);
  }
  const daysInMonth = [];
  for (let d = 1; d <= getDaysInMonth(monthDate); d++) {
    daysInMonth.push(<td key={d}>{d}</td>);
  }
  const totalSlots = [...blanks, ...daysInMonth];
  let rows: JSX.Element[][] = [];
  let cells: JSX.Element[] = [];
  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row); // if index not equal 7 that means not go to next week
    } else {
      rows.push(cells); // when reach next week we contain all td in last week to rows
      cells = []; // empty container
      cells.push(row); // in current loop we still push current row to new container
    }
    if (i === totalSlots.length - 1) {
      // when end loop we add remain date
      rows.push(cells);
    }
  });
  return (
    <table>
      <thead>
        {currentYear}
        <button onClick={decrementMonth}>Previous</button>
        {currentMonthName}
        <button onClick={incrementMonth}>Next</button>
        <tr>{weekDays}</tr>
      </thead>
      <tbody>
        {rows.map((d, i) => (
          <tr>{d}</tr>
        ))}
      </tbody>
    </table>
  );
};
