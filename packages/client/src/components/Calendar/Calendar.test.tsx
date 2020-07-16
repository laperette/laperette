import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import Axios from "axios";
import { render, wait } from "@testing-library/react";
import { Calendar } from "./Calendar";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

const mockSuccessCall = () => {
  mockedAxios.get.mockResolvedValueOnce({ data: [] });
};

const mockFailedCall = () => {
  mockedAxios.get.mockRejectedValueOnce(new Error("Unable to fetch bookings"));
};

describe("Calendar", () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  it("should display a loader while fetching the bookings, and then, the calendar", async () => {
    mockSuccessCall();
    const { getByText } = render(<Calendar />);
    expect(getByText(/loading.../i)).toBeInTheDocument();
    await wait();
    expect(getByText(/lundi/i)).toBeInTheDocument();
  });

  it("should display a loader while fetching the bookings, and then, the error page if fetching the bookings failed", async () => {
    mockFailedCall();
    const { getByText } = render(<Calendar />);
    expect(getByText(/loading.../i)).toBeInTheDocument();
    await wait();
    expect(getByText(/Unable to fetch bookings/i)).toBeInTheDocument();
  });
});
