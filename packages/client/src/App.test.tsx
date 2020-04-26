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

  it("should display loading while fetching the bookings", () => {
    mockCall();
    const { getByText } = render(<App />);
    expect(getByText(/loading.../i)).toBeInTheDocument();
  });
  it("should display the calendar when fetching the bookings is done", async () => {
    mockCall();
    const { getByText } = render(<App />);
    await wait();
    expect(getByText(/lundi/i)).toBeInTheDocument();
  });
});
