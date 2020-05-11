import React from "react";
import { Box, Text } from "grommet";
import { Sync } from "grommet-icons";

export const FullPageSpinner = () => (
  <Box fill justify="center" align="center">
    <Text size="xxlarge">
      <Sync /> loading...
    </Text>
  </Box>
);
