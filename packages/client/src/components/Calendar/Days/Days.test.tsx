import React from "react";
import { render, screen } from "@testing-library/react";
import { Days } from "./Days";

describe(Days.name, () => {
  it("should display the correct number of cells", async () => {
    const mockDaysToDisplay = [
      new Date("Mon Jul 27 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Jul 28 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Jul 29 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Jul 30 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Jul 31 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Aug 01 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Aug 02 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Mon Aug 03 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Aug 04 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Aug 05 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Aug 06 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Aug 07 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Aug 08 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Aug 09 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Mon Aug 10 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Aug 11 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Aug 12 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Aug 13 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Aug 14 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Aug 15 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Aug 16 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Mon Aug 17 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Aug 18 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Aug 19 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Aug 20 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Aug 21 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Aug 22 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Aug 23 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Mon Aug 24 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Aug 25 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Aug 26 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Aug 27 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Aug 28 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Aug 29 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Aug 30 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Mon Aug 31 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Tue Sep 01 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Wed Sep 02 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Thu Sep 03 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Fri Sep 04 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sat Sep 05 2020 00:00:00 GMT+0100 (British Summer Time)"),
      new Date("Sun Sep 06 2020 00:00:00 GMT+0100 (British Summer Time)"),
    ];

    const mockCurrentMonthName = "Août";

    await render(
      <Days
        daysToDisplay={mockDaysToDisplay}
        currentMonthName={mockCurrentMonthName}
        bookings={[]}
      />,
    );

    const cells = screen.getAllByTestId("day-text");

    expect(cells.length).toEqual(42);
  });
});
