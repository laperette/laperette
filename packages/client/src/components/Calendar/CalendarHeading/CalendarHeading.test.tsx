import React from "react";
import { render } from "@testing-library/react";
import { CalendarHeading } from "./CalendarHeading";

describe(CalendarHeading.name, () => {
  it("should display all the days of the week", () => {
    const { getByText } = render(<CalendarHeading />);

    const monday = getByText(/Monday/);
    const tuesday = getByText(/Tuesday/);
    const wednesday = getByText(/Wednesday/);
    const thursday = getByText(/Thursday/);
    const friday = getByText(/Friday/);
    const saturday = getByText(/Saturday/);
    const sunday = getByText(/Sunday/);

    expect(monday).toBeInTheDocument();
    expect(tuesday).toBeInTheDocument();
    expect(wednesday).toBeInTheDocument();
    expect(thursday).toBeInTheDocument();
    expect(friday).toBeInTheDocument();
    expect(saturday).toBeInTheDocument();
    expect(sunday).toBeInTheDocument();
  });
});
