import {
  startOfMonth,
  getDay,
  subDays,
  addDays,
  eachDayOfInterval,
} from "date-fns";

interface CalendarState {
  currentMonthNumber: number;
  currentYear: number;
}

export const useCalendarData = ({
  currentMonthNumber,
  currentYear,
}: CalendarState) => {
  const firstDayInCurrentMonth = startOfMonth(
    new Date(currentYear, currentMonthNumber, 15),
  );

  const placeInWeekFirstDayOfMonth = getDay(firstDayInCurrentMonth);

  const numberOfDaysToTakeFromFormerMonth =
    placeInWeekFirstDayOfMonth === 0 ? 6 : placeInWeekFirstDayOfMonth - 1;

  const daysToDisplay = eachDayOfInterval({
    start: subDays(firstDayInCurrentMonth, numberOfDaysToTakeFromFormerMonth),
    end: addDays(
      subDays(firstDayInCurrentMonth, numberOfDaysToTakeFromFormerMonth),
      41,
    ),
  });

  return [daysToDisplay];
};
