import React from "react";
import Axios from "axios";
import { render, screen, waitForDomChange } from "@testing-library/react";
import { Calendar } from "./Calendar";
import { getRandomIntegerInclusive } from "../../utils/calendar";
import * as MockDate from "mockdate";
import {
  startOfMonth,
  getDay,
  isMonday,
  isSunday,
  addMonths,
  subMonths,
  isThisMonth,
} from "date-fns";
import userEvent from "@testing-library/user-event";
import { cache } from "swr";
const mockSetSelectedBooking = jest.fn();

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
mockedAxios.create.mockImplementation(() => Axios);

const mockSuccessCall = () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { bookings: [] } });
};

const mockFailedCall = () => {
  mockedAxios.get.mockRejectedValueOnce(new Error("Unable to fetch bookings"));
};

describe("Calendar", () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
    cache.clear();
  });
  describe("Loader", () => {
    it("should display a loader while fetching the bookings, and then, the error page if fetching the bookings failed", async () => {
      mockFailedCall();
      const { container, getByTestId, getByText } = render(
        <Calendar setSelectedBooking={() => {}} />,
      );
      expect(getByTestId("full-page-spinner")).toBeInTheDocument();
      await waitForDomChange({ container });
      expect(getByText(/Unable to fetch bookings/i)).toBeInTheDocument();
    });

    it("should display a loader while fetching the bookings, and then, the calendar", async () => {
      mockSuccessCall();
      const { getByText, container, getByTestId } = render(
        <Calendar setSelectedBooking={() => {}} />,
      );
      expect(getByTestId("full-page-spinner")).toBeInTheDocument();
      await waitForDomChange({ container });
      expect(getByText("Today")).toBeInTheDocument();
      expect(getByText("Monday")).toBeInTheDocument();
    });
  });

  describe("Days to display", () => {
    const mockCurrentDateNumber = getRandomIntegerInclusive(1, 20);
    const mockCurrentMonthNumber = getRandomIntegerInclusive(0, 11);
    const mockCurrentYear = getRandomIntegerInclusive(2020, 2050);

    const mockRandomDate = new Date(
      mockCurrentYear,
      mockCurrentDateNumber,
      mockCurrentMonthNumber,
    );

    beforeAll(() => {
      MockDate.set(mockRandomDate);
    });

    afterAll(() => {
      MockDate.reset();
    });

    it("should display the correct number of days in the calendar", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );
      await waitForDomChange({ container });

      const daysDisplayed = screen.getAllByTestId("day-text");
      expect(daysDisplayed.length).toEqual(42);
    });

    it("should display the first day of the current month in its correct position in the week", async () => {
      const firstDayInMonth = startOfMonth(mockRandomDate);

      const dayNumberFirstDayInMonth = getDay(firstDayInMonth); // Sunday returned as 0

      const expectedPositionInCalendar =
        dayNumberFirstDayInMonth === 0 ? 7 : dayNumberFirstDayInMonth;

      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const firstDayInMonthFromCalendar = screen.getAllByText(/1st/)[0];

      const positionFirstDayInMonthFromCalendar = parseInt(
        firstDayInMonthFromCalendar.id.split("-")[0],
        10,
      );

      expect(positionFirstDayInMonthFromCalendar).toEqual(
        expectedPositionInCalendar,
      );
    });

    it("should display a Monday as the first day of the calendar", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const firstDayOfCalendar = screen.getAllByTestId("day-text")[0];

      const dateStoredInCellId = new Date(firstDayOfCalendar.id.split("-")[1]);

      expect(isMonday(dateStoredInCellId)).toBeTruthy();
    });

    it("should display a Sunday as the last day of the calendar", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const lastDayOfCalendar = screen
        .getAllByTestId("day-text")
        .pop() as HTMLElement;

      const dateStoredInCellId = new Date(lastDayOfCalendar.id.split("-")[1]);

      expect(isSunday(dateStoredInCellId)).toBeTruthy();
    });
  });

  describe("Navigation buttons", () => {
    it("should display next month's days when clicking on Next button", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const firstDayInMonthBeforeClick = new Date(
        screen.getAllByText(/1st/)[0].id.split("-")[1],
      );

      const nextButton = screen.getByLabelText(/next/);

      userEvent.click(nextButton);

      const firstDayInMonthAfterClick = new Date(
        screen.getAllByText(/1st/)[0].id.split("-")[1],
      );

      expect(addMonths(firstDayInMonthBeforeClick, 1)).toEqual(
        firstDayInMonthAfterClick,
      );
    });

    it("should display previous month's days when clicking on Previous button", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const firstDayInMonthBeforeClick = new Date(
        screen.getAllByText(/1st/)[0].id.split("-")[1],
      );

      const previousButton = screen.getByLabelText(/previous/);

      userEvent.click(previousButton);

      const firstDayInMonthAfterClick = new Date(
        screen.getAllByText(/1st/)[0].id.split("-")[1],
      );

      expect(subMonths(firstDayInMonthBeforeClick, 1)).toEqual(
        firstDayInMonthAfterClick,
      );
    });

    it("should display today's month's days when clicking on Today button", async () => {
      mockSuccessCall();
      const { container } = render(
        <Calendar setSelectedBooking={mockSetSelectedBooking} />,
      );

      await waitForDomChange({ container });

      const previousButton = screen.getByLabelText(/previous/);

      userEvent.click(previousButton);
      userEvent.click(previousButton);
      userEvent.click(previousButton);

      const todayButton = screen.getByText(/Today/);

      userEvent.click(todayButton);

      const firstDayInMonthAfterClick = new Date(
        screen.getAllByText(/1st/)[0].id.split("-")[1],
      );

      expect(isThisMonth(firstDayInMonthAfterClick)).toBeTruthy();
    });
  });
});
