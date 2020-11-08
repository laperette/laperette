import { Box, Typography } from "@material-ui/core";
import React from "react";
import { WEEK_DAYS_NAMES } from "../../../utils/constants";

export const CalendarHeading = () => {
  return (
    <>
      {WEEK_DAYS_NAMES.map((name) => (
        <Box
          key={name}
          display="flex"
          justifyContent="center"
          bgcolor="rgb(245, 245, 245)"
          padding={1}
        >
          <Typography variant="body2">
            {name.slice(0, 3).toUpperCase()}
          </Typography>
        </Box>
      ))}
    </>
  );
};
