import React from "react";
import { Box, Text } from "grommet";

export const FullPageErrorFallback = ({ error }: { error: Error | null }) => {
  return (
    <Box fill justify="center" align="center">
      <Text size="xxlarge">
        Uh oh... There's a problem. Try refreshing the app.
      </Text>
      <pre>{error?.message}</pre>
    </Box>
  );
};
