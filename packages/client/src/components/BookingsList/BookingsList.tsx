import React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  GridList,
  GridListTile,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
import { formatDate } from "../../utils/calendar";
import { useBookings } from "../../hooks/useBookings";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "column",
    overflow: "hidden",
    fontFamily: "sans-serif",
  },
  gridList: {
    width: 500,
    height: 300,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export const BookingsList = () => {
  const { data: bookings, error } = useBookings();

  const classes = useStyles();

  if (error) {
    return <FullPageErrorFallback error={error} />;
  }
  if (!bookings) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Typography variant="h4" align="left" gutterBottom>
        Your bookings
      </Typography>
      <GridList cellHeight={180} className={classes.gridList} spacing={15}>
        {bookings.map((booking) => {
          return (
            <GridListTile>
              <Card>
                <CardContent>
                  <Typography gutterBottom component="h5" align="center">
                    {booking.houseName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {formatDate(booking.arrivalTime)}
                    {/* {formatDate(booking.departureTime)} */}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {formatDate(booking.departureTime)}
                  </Typography>
                </CardContent>
                <Divider light />
                <CardActions>
                  <Button size="small" color="primary" fullWidth>
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            </GridListTile>
          );
        })}
      </GridList>
    </>
  );
};
