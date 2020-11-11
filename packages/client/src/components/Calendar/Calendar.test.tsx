import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addMonths,
  getDay,
  isMonday,
  isSunday,
  isThisMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import * as MockDate from "mockdate";
import React from "react";
import { cache } from "swr";
import { TestWrapper } from "../../contexts/TestWrapper";
import * as useBookings from "../../hooks/useBookings";
import { getRandomIntegerInclusive } from "../../utils/calendar";
import { Calendar } from "./Calendar";

jest.mock("../../hooks/useBookings");
const mockedUseBookings = useBookings as jest.Mocked<typeof useBookings>;
mockedUseBookings.useBookings.mockImplementation(() => ({
  revalidate: async () => false,
  mutate: async () => null,
  isValidating: false,
  bookings: [],
}));

const setupTest = async () => {
  const mockSetSelectedBooking = jest.fn();
  const renderResult = render(
    <Calendar setSelectedBooking={mockSetSelectedBooking} />,
    { wrapper: (props) => <TestWrapper {...props} /> },
  );

  return { ...renderResult, mockSetSelectedBooking };
};

describe("Calendar", () => {
  afterEach(() => {
    mockedUseBookings.useBookings.mockClear();
    cache.clear();
  });
  describe("Loader", () => {
    it("should display a loader while fetching the bookings, and then, the error page if fetching the bookings failed", async () => {
      mockedUseBookings.useBookings.mockReturnValueOnce({
        revalidate: async () => false,
        mutate: async () => null,
        isValidating: true,
        bookings: null,
      });

      const { getByTestId } = await setupTest();

      expect(getByTestId("full-page-spinner")).toBeInTheDocument();
    });

    it("should display  the calendar", async () => {
      const { getByText } = await setupTest();

      expect(getByText("Today")).toBeInTheDocument();
      expect(getByText("MON")).toBeInTheDocument();
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
      const { getAllByTestId } = await setupTest();

      const daysDisplayed = getAllByTestId("day-text");
      expect(daysDisplayed.length).toEqual(42);
    });

    it("should display the first day of the current month in its correct position in the week", async () => {
      const firstDayInMonth = startOfMonth(mockRandomDate);
      const dayNumberFirstDayInMonth = getDay(firstDayInMonth); // Sunday returned as 0
      const expectedPositionInCalendar =
        dayNumberFirstDayInMonth === 0 ? 7 : dayNumberFirstDayInMonth;

      const { getAllByText } = await setupTest();

      const firstDayInMonthFromCalendar = getAllByText(/1st/)[0];
      const positionFirstDayInMonthFromCalendar = parseInt(
        firstDayInMonthFromCalendar.id.split("-")[0],
        10,
      );
      expect(positionFirstDayInMonthFromCalendar).toEqual(
        expectedPositionInCalendar,
      );
    });

    it("should display a Monday as the first day of the calendar", async () => {
      const { getAllByTestId } = await setupTest();

      const firstDayOfCalendar = getAllByTestId("day-text")[0];
      const dateStoredInCellId = new Date(firstDayOfCalendar.id.split("-")[1]);
      expect(isMonday(dateStoredInCellId)).toBeTruthy();
    });

    it("should display a Sunday as the last day of the calendar", async () => {
      const { getAllByTestId } = await setupTest();

      const lastDayOfCalendar = getAllByTestId("day-text").pop() as HTMLElement;
      const dateStoredInCellId = new Date(lastDayOfCalendar.id.split("-")[1]);
      expect(isSunday(dateStoredInCellId)).toBeTruthy();
    });
  });

  describe("Navigation buttons", () => {
    it("should display next month's days when clicking on Next button", async () => {
      const { getAllByText, getByLabelText } = await setupTest();

      const firstDayInMonthBeforeClick = new Date(
        getAllByText(/1st/)[0].id.split("-")[1],
      );
      const nextButton = getByLabelText(/next/);
      userEvent.click(nextButton);
      const firstDayInMonthAfterClick = new Date(
        getAllByText(/1st/)[0].id.split("-")[1],
      );
      expect(addMonths(firstDayInMonthBeforeClick, 1)).toEqual(
        firstDayInMonthAfterClick,
      );
    });

    it("should display previous month's days when clicking on Previous button", async () => {
      const { getAllByText, getByLabelText } = await setupTest();

      const firstDayInMonthBeforeClick = new Date(
        getAllByText(/1st/)[0].id.split("-")[1],
      );
      const previousButton = getByLabelText(/previous/);
      userEvent.click(previousButton);
      const firstDayInMonthAfterClick = new Date(
        getAllByText(/1st/)[0].id.split("-")[1],
      );
      expect(subMonths(firstDayInMonthBeforeClick, 1)).toEqual(
        firstDayInMonthAfterClick,
      );
    });

    it("should display today's month's days when clicking on Today button", async () => {
      const { getByText, getByLabelText, getAllByText } = await setupTest();

      const previousButton = getByLabelText(/previous/);

      userEvent.click(previousButton);
      userEvent.click(previousButton);
      userEvent.click(previousButton);

      const todayButton = getByText(/Today/);

      userEvent.click(todayButton);

      const firstDayInMonthAfterClick = new Date(
        getAllByText(/1st/)[0].id.split("-")[1],
      );

      expect(isThisMonth(firstDayInMonthAfterClick)).toBeTruthy();
    });
  });
});
