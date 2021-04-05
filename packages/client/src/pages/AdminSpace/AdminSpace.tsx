import React from "react";

// import { HousesList } from "../../components/HousesList/HousesList";
// import { BookingsList } from "../../components/BookingsList/BookingsList";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
// import { useHouses } from "../../hooks/useHouses";

export const AdminSpace = () => {
  // const { houses } = useHouses();

  return (
    <>
      <Typography variant="h3" align="left" gutterBottom>
        Admin Space
      </Typography>
      <Grid container justify="space-evenly" spacing={3}>
        <Grid item>{/* <HousesList /> */}</Grid>
        <Grid item>{/* <BookingsList houses={houses} /> */}</Grid>
      </Grid>
    </>
  );
};
