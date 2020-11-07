import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { AuthClientType } from "../utils/authClient";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          backgroundColor: "rgb(245, 245, 245);",
        },
        body: {
          backgroundColor: "rgb(245, 245, 245);",
        },
      },
    },
  },
});

export const AppProviders = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClientType;
}) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SWRConfig value={{ fetcher }}>
      <Router>
        <AuthProvider authClient={authClient}>{children}</AuthProvider>
      </Router>
    </SWRConfig>
  </ThemeProvider>
);
