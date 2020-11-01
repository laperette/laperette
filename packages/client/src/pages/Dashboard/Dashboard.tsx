import React from "react";

import { HousesList } from "../../components/HousesList/HousesList";
import { BookingsList } from "../../components/BookingsList/BookingsList";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

export const Dashboard = () => {
  return (
    <>
      <Typography variant="h3" align="left" gutterBottom>
        Dashboard
      </Typography>
      <Grid container justify="space-evenly" spacing={3}>
        <Grid item>
          <HousesList />
        </Grid>
        <Grid item>
          <BookingsList />
        </Grid>
      </Grid>
    </>
  );
};
