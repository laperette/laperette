import React from "react";
import { render, wait } from "@testing-library/react";
import { App } from "./App";
import { AppProviders } from "./contexts/AppProviders";

describe("App", () => {
  it("should display a loading spinner and then the login page if not authenticated ", async () => {
    const { getByText } = render(<App />, {
      wrapper: ({ children }) => <AppProviders>{children}</AppProviders>,
    });
    expect(getByText(/loading/i)).toBeInTheDocument();
    await wait();
    expect(getByText(/log in/i)).toBeInTheDocument();
  });

  it("should display a loader while fetching the bookings, and then, the calendar", async () => {
    mockCall();
    const { getByText } = render(<App />);
    expect(getByText(/loading.../i)).toBeInTheDocument();
    await wait();
    expect(getByText(/lundi/i)).toBeInTheDocument();
  });
});
