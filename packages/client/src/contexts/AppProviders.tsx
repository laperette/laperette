import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { AuthClientType } from "../utils/authClient";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ErrorBoundary } from "../components/ErrorBoundary";
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
            <AuthProvider authClient={authClient}>{children}</AuthProvider>
          </Router>
        </SWRConfig>
      </ThemeProvider>
    </StyledThemeProvider>
  </ErrorBoundary>
);
