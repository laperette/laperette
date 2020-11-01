import React, { useLayoutEffect } from "react";

import Axios from "axios";

import { useAsync } from "../../hooks/useAsync";
import { useCalendarActions } from "../../hooks/useCalendarAction";
import { FullPageSpinner } from "../FullPageSpinner";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { MONTHS_NAMES } from "../../utils/constants";
import { serializeBooking } from "../../utils/bookings";
import { Days } from "./Days/Days";
import { CalendarHeading } from "./CalendarHeading/CalendarHeading";
import { useCalendarData } from "../../hooks/useCalendarData";
import { Chip, IconButton } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import styled from "styled-components";
import { Booking } from "../../types";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Chips = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 9fr;
  grid-column-gap: 5px;
  grid-column-start: 2;
`;

const Display = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  justify-items: center;
`;

const Arrow = styled.div`
  align-self: center;
  justify-self: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  min-width: 100%;
`;

interface Props {
  setSelectedBooking: (booking: Booking) => void;
}

export const Calendar = ({ setSelectedBooking }: Props) => {
  const { data: bookings, run, isIdle, isLoading, isError, error } = useAsync<
    Booking[] | null
  >();

  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions();

  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const [daysToDisplay] = useCalendarData({ currentMonthNumber, currentYear });

  useLayoutEffect(() => {
    const getBookings = async (): Promise<Booking[]> => {
      const response = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookings`,
        {
          params: {
            start: daysToDisplay[0],
            end: daysToDisplay[daysToDisplay.length - 1],
          },
          withCredentials: true,
        },
      );

      if (!response?.data || !response?.data?.bookings.length) {
        return [];
      }

      return response.data.bookings.map(serializeBooking);
    };
    run(getBookings());
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isIdle || isLoading || !bookings) {
    return <FullPageSpinner />;
  }

  return (
    <Layout>
      <Chips>
        <div></div>
        <Chip label="Today" onClick={resetToDate} />
        <Chip label={`${currentMonthName} ${currentYear}`} />
      </Chips>
      <Display>
        <Arrow>
          <IconButton aria-label="previous" onClick={decrementMonth}>
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </Arrow>

        <CalendarGrid>
          <CalendarHeading />
          <Days
            daysToDisplay={daysToDisplay}
            currentMonthName={currentMonthName}
            bookings={bookings}
            setSelectedBooking={setSelectedBooking}
          />
        </CalendarGrid>
        <Arrow>
          <IconButton aria-label="next" onClick={incrementMonth}>
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Arrow>
      </Display>
    </Layout>
  );
};
