import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { Calendar } from "../../components/Calendar/Calendar";
import { SelectedBooking } from "../../components/SelectedBooking";
import { Booking } from "../../types";

export const HouseSpace = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        align-self="center"
      >
        <Grid item sm={12} md={9}>
          <Calendar setSelectedBooking={setSelectedBooking} />
        </Grid>
        <Grid item container justify="center" sm={12} md={3}>
          <SelectedBooking selectedBooking={selectedBooking} />
        </Grid>
      </Grid>
    </>
  );
};
