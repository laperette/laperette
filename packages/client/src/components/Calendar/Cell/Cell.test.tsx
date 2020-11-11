import React from "react";
import { render } from "@testing-library/react";
import { Cell } from "./Cell";

const mockSetSelectedBooking = jest.fn();

describe(Cell.name, () => {
  describe("when the day displayed is not part of the month currently displayed", () => {
    it("should display the day as light grey", async () => {
      const currentMonthBeingDisplayed = "August";
      const dayFromFormerMonth = new Date("Mon Jul 27 2020");
      const dayNumber = 1;

      const { getByTestId } = render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
          setSelectedBooking={mockSetSelectedBooking}
        />,
      );

      const dateText = getByTestId("day-text").className;
      expect(dateText).toEqual(
        expect.stringContaining("MuiTypography-colorTextSecondary"),
      );
    });
  });

  describe("when the day displayed is part of the month displayed", () => {
    it("should display the day as plain black", async () => {
      const currentMonthBeingDisplayed = "August";
      const dayFromFormerMonth = new Date("Fri Aug 07 2020");
      const dayNumber = 12;

      const { getByTestId } = render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
          setSelectedBooking={mockSetSelectedBooking}
        />,
      );

      const dateText = getByTestId("day-text").className;
      expect(dateText).toEqual(
        expect.stringContaining("MuiTypography-colorTextPrimary"),
      );
    });
  });
});
