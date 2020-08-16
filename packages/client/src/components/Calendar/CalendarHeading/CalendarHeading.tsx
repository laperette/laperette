import React from "react";
import { Box, Heading } from "grommet";
import { WEEK_DAYS_NAMES } from "../../../utils/constants";

export const CalendarHeading = () => {
  return (
    <React.Fragment>
      {WEEK_DAYS_NAMES.map((name) => (
        <Box alignSelf="center" gridArea={name} key={name}>
          <Heading alignSelf="center" level="5">
            {name}
          </Heading>
        </Box>
      ))}
    </React.Fragment>
  );
};