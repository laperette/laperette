import React from "react";
import { render } from "@testing-library/react";
import { CalendarHeading } from "./CalendarHeading";

describe(CalendarHeading.name, () => {
  it("should display all the days of the week", async () => {
    const { findByText } = render(<CalendarHeading />);

    const monday = await findByText(/Monday/);
    const tuesday = await findByText(/Tuesday/);
    const wednesday = await findByText(/Wednesday/);
    const thursday = await findByText(/Thursday/);
    const friday = await findByText(/Friday/);
    const saturday = await findByText(/Saturday/);
    const sunday = await findByText(/Sunday/);

    expect(monday).toBeInTheDocument();
    expect(tuesday).toBeInTheDocument();
    expect(wednesday).toBeInTheDocument();
    expect(thursday).toBeInTheDocument();
    expect(friday).toBeInTheDocument();
    expect(saturday).toBeInTheDocument();
    expect(sunday).toBeInTheDocument();
  });
});
