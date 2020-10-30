import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { Calendar } from "../Calendar/Calendar";
import { SelectedBooking } from "../SelectedBooking";
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
        <Grid item xs={12} sm={6}>
          <Calendar setSelectedBooking={setSelectedBooking} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectedBooking selectedBooking={selectedBooking} />
        </Grid>
      </Grid>
    </>
  );
};
