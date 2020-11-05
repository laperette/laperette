import React from "react";

import { HousesList } from "../../components/HousesList/HousesList";
import { BookingsList } from "../../components/BookingsList/BookingsList";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { House } from "../../types";

export const Dashboard = () => {
  const [houses, setHouses] = React.useState<House[]>();

  const retrieveHousesForBookingForm = (houses: House[]) => {
    setHouses(houses);
  };

  return (
    <>
      <Typography variant="h3" align="left" gutterBottom>
        Dashboard
      </Typography>
      <Grid container justify="space-evenly" spacing={3}>
        <Grid item>
          <HousesList
            retrieveHousesForBookingForm={retrieveHousesForBookingForm}
          />
        </Grid>
        <Grid item>
          <BookingsList houses={houses} />
        </Grid>
      </Grid>
    </>
  );
};
