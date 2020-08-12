import React from "react";
import { render } from "@testing-library/react";
import { CalendarHeading } from "./CalendarHeading";

describe(CalendarHeading.name, () => {
  it("should display all the days of the week", async () => {
    const { findByText } = render(<CalendarHeading />);

    const monday = await findByText(/Lundi/);
    const tuesday = await findByText(/Mardi/);
    const wednesday = await findByText(/Mercredi/);
    const thursday = await findByText(/Jeudi/);
    const friday = await findByText(/Vendredi/);
    const saturday = await findByText(/Samedi/);
    const sunday = await findByText(/Dimanche/);

    expect(monday).toBeInTheDocument();
    expect(tuesday).toBeInTheDocument();
    expect(wednesday).toBeInTheDocument();
    expect(thursday).toBeInTheDocument();
    expect(friday).toBeInTheDocument();
    expect(saturday).toBeInTheDocument();
    expect(sunday).toBeInTheDocument();
  });
});
