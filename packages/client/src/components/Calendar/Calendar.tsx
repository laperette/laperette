import { Chip, IconButton } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import React from "react";
import styled from "styled-components";
import { useBookings } from "../../hooks/useBookings";
import { useCalendarActions } from "../../hooks/useCalendarAction";
import { useCalendarData } from "../../hooks/useCalendarData";
import { Booking } from "../../types";
import { MONTHS_NAMES } from "../../utils/constants";

import { FullPageSpinner } from "../FullPageSpinner";
import { CalendarHeading } from "./CalendarHeading/CalendarHeading";
import { Days } from "./Days/Days";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Chips = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 9fr;
  grid-column-gap: 5px;
  grid-column-start: 2;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const Display = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  justify-items: center;
  height: 100%;
`;

const Arrow = styled.div`
  align-self: center;
  justify-self: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr repeat(6, 2fr);
  min-width: 100%;
  grid-gap: 2px;
  background-color: white;
`;

interface Props {
  setSelectedBooking: (booking: Booking) => void;
}

export const Calendar = ({ setSelectedBooking }: Props) => {
  const { bookings } = useBookings();

  const {
    currentMonthNumber,
    currentYear,
    decrementMonth,
    incrementMonth,
    resetToDate,
  } = useCalendarActions();

  const currentMonthName = MONTHS_NAMES[currentMonthNumber];

  const [daysToDisplay] = useCalendarData({ currentMonthNumber, currentYear });

  if (!bookings) {
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
