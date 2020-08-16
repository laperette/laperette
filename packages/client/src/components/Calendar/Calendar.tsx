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
import { WEEK_DAYS_NAMES, MONTHS_NAMES } from "../../utils/constants";
import { serializeBooking } from "../../utils/bookings";
import { Navigation } from "./Navigation/Navigation";
import { Days } from "./Days/Days";
import { CalendarHeading } from "./CalendarHeading/CalendarHeading";
import { useCalendarData } from "../../hooks/useCalendarData";

export interface Booking {
  interval: {
    start: Date;
    end: Date;
  };
  firstName: string;
  lastName: string;
  bookingId: string;
  bookingStatus: string;
  comments: string;
  companions: string;
}

export const Calendar = () => {
  const { data: bookings, run, isIdle, isLoading, isError, error } = useAsync<
    Booking[] | null
  >();

  useLayoutEffect(() => {
    const getBookings = async (): Promise<Booking[]> => {
      const response = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookings`,
      );
      return response.data.map(serializeBooking);
    };
    run(getBookings());
  }, [run]);

  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions();

  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const [daysToDisplay] = useCalendarData({ currentMonthNumber, currentYear });

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
        daysToDisplay={daysToDisplay}
        currentMonthName={currentMonthName}
        bookings={bookings}
      />
    </Grid>
  );
};
