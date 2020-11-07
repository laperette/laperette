import { render, waitFor } from "@testing-library/react";
import Axios from "axios";
import React from "react";
import { cache } from "swr";
import { App } from "./App";
import { AppProviders } from "./contexts/AppProviders";
import { authClientFactory, userFactory } from "./utils/factories";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
mockedAxios.create.mockImplementation(() => Axios);

const mockSuccessCall = () => {
  mockedAxios.get.mockResolvedValueOnce({ data: userFactory() });
};

const mockFailedCall = () => {
  mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } });
};

describe("App", () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
    cache.clear();
  });
  it("should display a loading spinner and then the login page if not authenticated or if an error occured", async () => {
    mockFailedCall();
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
    mockSuccessCall();
    const { getByText } = render(<App />, {
      wrapper: ({ children }) => (
        <AppProviders authClient={authClientFactory()}>{children}</AppProviders>
      ),
    });
    await waitFor(() => {
      expect(getByText(/La Perette/i)).toBeInTheDocument();
    });
  });
});
