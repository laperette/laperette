import React from "react";
import { Grommet, Box } from "grommet";
import { AuthProvider } from "./AuthContext";
import { theme } from "../theme";
import { AuthClient } from "../utils/authClient";

export const AppProviders = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClient;
}) => (
  <Grommet theme={theme}>
    <Box height="100vh" background="light-1">
      <AuthProvider authClient={authClient}>{children}</AuthProvider>
    </Box>
  </Grommet>
);
