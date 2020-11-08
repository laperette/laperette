import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import React from "react";
import { cache } from "swr";
import { App } from "./App";
import { AppProviders } from "./contexts/AppProviders";
import * as useBookings from "./hooks/useBookings";
import * as useCurrentAccount from "./hooks/useCurrentAccount";
import { authClientFactory, userFactory } from "./utils/factories";

jest.mock("./hooks/useCurrentAccount");
const mockedUseCurrentAccount = useCurrentAccount as jest.Mocked<
  typeof useCurrentAccount
>;
mockedUseCurrentAccount.useCurrentAccount.mockImplementation(() => ({
  revalidate: async () => false,
  mutate: async () => null,
  isValidating: false,
  data: userFactory(),
}));

jest.mock("./hooks/useBookings");
const mockedUseBookings = useBookings as jest.Mocked<typeof useBookings>;
mockedUseBookings.useBookings.mockImplementation(() => ({
  revalidate: async () => false,
  mutate: async () => null,
  isValidating: false,
  bookings: [],
}));

describe("App", () => {
  afterEach(() => {
    mockedUseCurrentAccount.useCurrentAccount.mockClear();
    cache.clear();
  });
  it("should display a loading spinner and then the login page if not authenticated or if an error occured", async () => {
    mockedUseCurrentAccount.useCurrentAccount.mockReturnValueOnce({
      revalidate: async () => false,
      mutate: async () => null,
      isValidating: false,
      data: null,
      error: { response: { status: 401 } } as AxiosError,
    });
    const { getByTestId, getByText } = render(<App />, {
      wrapper: ({ children }) => (
        <AppProviders authClient={authClientFactory()}>{children}</AppProviders>
      ),
    });
    expect(getByTestId("full-page-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(getByTestId("full-page-spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(getByText(/log in/i)).toBeInTheDocument();
    });
  });
  it("should display a loading spinner and then the authenticated page if authenticated", async () => {
    const { getByText, getByTestId } = render(<App />, {
      wrapper: ({ children }) => (
        <AppProviders authClient={authClientFactory()}>{children}</AppProviders>
      ),
    });
    expect(getByTestId("full-page-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText(/La Perette/i)).toBeInTheDocument();
    });
    expect(getByText(/Logout/i)).toBeInTheDocument();
  });
  it("should render the login page on click on logout", async () => {
    const { getByText } = render(<App />, {
      wrapper: ({ children }) => (
        <AppProviders authClient={authClientFactory()}>{children}</AppProviders>
      ),
    });
    await waitFor(() => {
      expect(getByText(/La Perette/i)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(getByText(/Logout/i));
    });
    await waitFor(() => {
      expect(getByText(/log in/i)).toBeInTheDocument();
    });
  });
  it("should render the authenticated page if login was successful", async () => {
    const { getByText, getByLabelText, getByTestId } = render(<App />, {
      wrapper: ({ children }) => (
        <AppProviders authClient={authClientFactory()}>{children}</AppProviders>
      ),
    });
    await waitFor(() => {
      expect(getByText(/log in/i)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(getByLabelText(/email/i), {
        target: { value: "admin@mail.fr" },
      });
      fireEvent.change(getByLabelText(/password/i), {
        target: { value: "password" },
      });
      fireEvent.submit(getByTestId("signin-form"));
    });
    await waitFor(() => {
      expect(getByText(/La Perette/i)).toBeInTheDocument();
    });
  });
});
