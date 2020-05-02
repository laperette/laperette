import React from "react";
import { render, wait } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockCall = () => {
  mockedAxios.get.mockResolvedValueOnce({ data: [] });
};

describe("App", () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  it("should display a loader while fetching the bookings, and then, the calendar", async () => {
    mockCall();
    const { getByText } = render(<App />);
    expect(getByText(/loading.../i)).toBeInTheDocument();
    await wait();
    expect(getByText(/lundi/i)).toBeInTheDocument();
  });
});
