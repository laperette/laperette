import React from "react";
import { render, screen } from "@testing-library/react";
import { Cell } from "./Cell";

const mockSetSelectedBooking = jest.fn();

describe(Cell.name, () => {
  describe("when the day displayed is not part of the month currently displayed", () => {
    it("should display the day as light grey", async () => {
      const currentMonthBeingDisplayed = "August";

      const dayFromFormerMonth = new Date("Mon Jul 27 2020");

      const dayNumber = 1;

      render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
          setSelectedBooking={mockSetSelectedBooking}
        />,
      );

      const dateText = screen.getByTestId("day-text").className;

      const lightGreyClass = "StyledText-sc-1sadyjn-0 gnyGAa";

      expect(dateText).toEqual(lightGreyClass);
    });
  });

  describe("when the day displayed is part of the month displayed", () => {
    it("should display the day as plain black", async () => {
      const currentMonthBeingDisplayed = "August";

      const dayFromFormerMonth = new Date("Fri Aug 07 2020");

      const dayNumber = 12;

      render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
          setSelectedBooking={mockSetSelectedBooking}
        />,
      );

      const dateText = screen.getByTestId("day-text").className;

      const plainBlackClass = "StyledText-sc-1sadyjn-0 cpHmtS";

      expect(dateText).toEqual(plainBlackClass);
    });
  });
});
