import React from "react";
import { render, screen } from "@testing-library/react";
import { Cell } from "./Cell";

describe(Cell.name, () => {
  describe("when the day displayed is not part of the month currently displayed", () => {
    it("should display show the day as light grey", async () => {
      const currentMonthBeingDisplayed = "Août";

      const dayFromFormerMonth = new Date("Mon Jul 27 2020");

      const dayNumber = 1;

      await render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
        />,
      );

      const dateText = screen.getByTestId("day-text").className;

      const lightGreyClass = "StyledText-sc-1sadyjn-0 hjkHJt";

      expect(dateText).toEqual(lightGreyClass);
    });
  });

  describe("when the day displayed is part of the month displayed", () => {
    it("should display show the day as plain black", async () => {
      const currentMonthBeingDisplayed = "Août";

      const dayFromFormerMonth = new Date("Fri Aug 07 2020");

      const dayNumber = 12;

      await render(
        <Cell
          day={dayFromFormerMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
        />,
      );

      const dateText = screen.getByTestId("day-text").className;

      const plainBlackClass = "StyledText-sc-1sadyjn-0 iWUXAN";

      expect(dateText).toEqual(plainBlackClass);
    });
  });

  describe("when the day displayed is the first day of the month", () => {
    it("should display the month in the cell", async () => {
      const currentMonthBeingDisplayed = "Août";

      const firstDayOfTheMonth = new Date("Sat Aug 01 2020");

      const dayNumber = 6;

      await render(
        <Cell
          day={firstDayOfTheMonth}
          dayNumber={dayNumber}
          currentMonth={currentMonthBeingDisplayed}
        />,
      );

      const dateText = screen.getByTestId("day-text");

      expect(dateText.textContent?.includes("Août")).toBeTruthy();
    });
  });
});
