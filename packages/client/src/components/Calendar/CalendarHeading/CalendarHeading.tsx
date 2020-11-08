import { Box, Typography } from "@material-ui/core";
import React from "react";
import { WEEK_DAYS_NAMES } from "../../../utils/constants";

export const CalendarHeading = () => {
  return (
    <>
      {WEEK_DAYS_NAMES.map((name) => (
        <Box key={name} alignSelf="center" textAlign="center">
          <Typography>{name}</Typography>
        </Box>
      ))}
    </>
  );
};
