import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "./theme";

export const TestWrapper: React.FunctionComponent = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledThemeProvider>
);
