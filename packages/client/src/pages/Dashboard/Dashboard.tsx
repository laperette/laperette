import React from "react";

import { HousesList } from "../../components/HousesList/HousesList";
import { BookingsList } from "../../components/BookingsList/BookingsList";
import Grid from "@material-ui/core/Grid";

export const Dashboard = () => {
  return (
    <>
      <h1>Your dashboard</h1>
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
