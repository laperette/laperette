import React from "react";
import { render } from "@testing-library/react";
import { CalendarHeading } from "./CalendarHeading";

describe(CalendarHeading.name, () => {
  it("should display all the days of the week", () => {
    const { getByText } = render(<CalendarHeading />);

    const monday = getByText(/mon/i);
    const tuesday = getByText(/tue/i);
    const wednesday = getByText(/wed/i);
    const thursday = getByText(/thu/i);
    const friday = getByText(/fri/i);
    const saturday = getByText(/sat/i);
    const sunday = getByText(/sun/i);

    expect(monday).toBeInTheDocument();
    expect(tuesday).toBeInTheDocument();
    expect(wednesday).toBeInTheDocument();
    expect(thursday).toBeInTheDocument();
    expect(friday).toBeInTheDocument();
    expect(saturday).toBeInTheDocument();
    expect(sunday).toBeInTheDocument();
  });
});
