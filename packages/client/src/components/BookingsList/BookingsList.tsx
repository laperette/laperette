import Axios from "axios";
import React, { useLayoutEffect } from "react";

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

import { useAsync } from "../../hooks/useAsync";
import { Booking } from "../../types";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
import { formatDate } from "../../utils/calendar";
import { serializeBooking } from "../../utils/bookings";

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
    height: 400,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export const BookingsList = () => {
  const { data: bookings, run, isIdle, isLoading, isError, error } = useAsync<
    Booking[] | null
  >();

  const classes = useStyles();

  useLayoutEffect(() => {
    const getBookings = async (): Promise<Booking[]> => {
      const response = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookings`,
        {
          withCredentials: true,
        },
      );

      if (!response?.data || !response?.data?.bookings.length) {
        return [];
      }

      return response.data.bookings.map(serializeBooking);
    };
    run(getBookings());
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isIdle || isLoading || !bookings) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <h1>Your bookings</h1>
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
