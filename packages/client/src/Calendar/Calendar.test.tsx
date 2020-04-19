import { renderHook, act } from "@testing-library/react-hooks";
import { useCalendarActions } from "./Calendar";

describe("Calendar", () => {
  describe("useCalendarActions", () => {
    it("should increment the month number", () => {
      const { result } = renderHook(() =>
        useCalendarActions({ date: new Date("2020-05-01") }),
      );
      expect(result.current.currentMonthNumber).toBe(4);
      act(() => {
        result.current.incrementMonth();
      });
      expect(result.current.currentMonthNumber).toBe(5);
    });
    it("should set the month number at 0 if it pass a year, and increment the year", () => {
      const { result } = renderHook(() =>
        useCalendarActions({ date: new Date("2020-12-01") }),
      );
      expect(result.current.currentMonthNumber).toBe(11);
      act(() => {
        result.current.incrementMonth();
      });
      expect(result.current.currentMonthNumber).toBe(0);
      expect(result.current.currentYear).toBe(2021);
    });
    it("should decrement the month number", () => {
      const { result } = renderHook(() =>
        useCalendarActions({ date: new Date("2020-05-01") }),
      );
      expect(result.current.currentMonthNumber).toBe(4);
      act(() => {
        result.current.decrementMonth();
      });
      expect(result.current.currentMonthNumber).toBe(3);
    });
    it("should set the month number at 11 if it pass a year, and decrement the year", () => {
      const { result } = renderHook(() =>
        useCalendarActions({ date: new Date("2020-01-01") }),
      );
      expect(result.current.currentMonthNumber).toBe(0);
      act(() => {
        result.current.decrementMonth();
      });
      expect(result.current.currentMonthNumber).toBe(11);
      expect(result.current.currentYear).toBe(2019);
    });
  });
});
