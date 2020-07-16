import { renderHook } from "@testing-library/react-hooks";
import { useCalendarActions } from "./useCalendarAction";
import { act } from "react-dom/test-utils";

describe("useCalendarActions", () => {
  it("should increment the month number", () => {
    const { result } = renderHook(() => useCalendarActions());
    expect(result.currentMonthNumber).toBe(4);
    act(() => {
      result.incrementMonth();
    });
    expect(result.currentMonthNumber).toBe(5);
  });
  it("should set the month number at 0 if it pass a year, and increment the year", () => {
    const { result } = renderHook(() => useCalendarActions());
    expect(result.currentMonthNumber).toBe(11);
    act(() => {
      result.incrementMonth();
    });
    expect(result.currentMonthNumber).toBe(0);
    expect(result.currentYear).toBe(2021);
  });
  it("should decrement the month number", () => {
    const { result } = renderHook(() => useCalendarActions());
    expect(result.currentMonthNumber).toBe(4);
    act(() => {
      result.decrementMonth();
    });
    expect(result.currentMonthNumber).toBe(3);
  });
  it("should set the month number at 11 if it pass a year, and decrement the year", () => {
    const { result } = renderHook(() => useCalendarActions());
    expect(result.currentMonthNumber).toBe(0);
    act(() => {
      result.decrementMonth();
    });
    expect(result.currentMonthNumber).toBe(11);
    expect(result.currentYear).toBe(2019);
  });
});
