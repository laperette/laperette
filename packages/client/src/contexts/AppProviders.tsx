import React from "react";
import { AuthProvider } from "./AuthContext";
import { Grommet, Box } from "grommet";
import { theme } from "../theme";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Grommet theme={theme}>
    <Box height="100vh" background="light-1">
      <AuthProvider>{children}</AuthProvider>
    </Box>
  </Grommet>
);
