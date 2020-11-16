import DateFnsUtils from "@date-io/date-fns";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { SWRConfig } from "swr";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthClientType } from "../utils/authClient";
import { fetcher } from "../utils/fetcher";
import { AuthProvider } from "./AuthContext";
import { theme } from "./theme";

export const AppProviders = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClientType;
}) => (
  <ErrorBoundary>
    <StyledThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig value={{ fetcher }}>
          <Router>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <AuthProvider authClient={authClient}>{children}</AuthProvider>
            </MuiPickersUtilsProvider>
          </Router>
        </SWRConfig>
      </ThemeProvider>
    </StyledThemeProvider>
  </ErrorBoundary>
);
