import React, { useLayoutEffect } from "react";
import { Grid } from "grommet";
import range from "lodash/range";
import Axios from "axios";

import { Interval } from "date-fns";
import { repeat } from "../../utils";
import { useAsync } from "../../hooks/useAsync";
import { useCalendarActions } from "../../hooks/useCalendarAction";
import { FullPageSpinner } from "../FullPageSpinner";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { WEEK_DAYS_NAMES } from "../../utils/constants";
import { serializeBooking } from "../../utils/calendar";
import { Navigation } from "./Navigation/Navigation";
import { Days } from "./Days/Days";
import { CalendarHeading } from "./CalendarHeading/CalendarHeading";

export type Booking = {
  readonly name: string;
  readonly interval: Interval;
};

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

  const {
    previousMonthDays,
    currentMonthDays,
    nextMonthDays,
    currentMonthName,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions();

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isIdle || isLoading || !bookings) {
    return <FullPageSpinner />;
  }

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
      <Navigation
        decrementMonth={decrementMonth}
        resetToDate={resetToDate}
        incrementMonth={incrementMonth}
      />
      <CalendarHeading />
      <Days
        previousMonthDays={previousMonthDays}
        currentMonthDays={currentMonthDays}
        nextMonthDays={nextMonthDays}
        currentMonthName={currentMonthName}
      />
    </Grid>
  );
};
