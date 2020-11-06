import Axios from "axios";
import React, { useLayoutEffect } from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Drawer,
  Fab,
  GridList,
  GridListTile,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Booking, House, NewBookingBody } from "../../types";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
import { formatDate } from "../../utils/calendar";
import { serializeBooking } from "../../utils/bookings";
import { NewBookingForm } from "../NewBookingForm";

interface Props {
  houses?: House[];
}

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
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export const BookingsList = ({ houses }: Props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookingsToDisplay, setBookingsToDisplay] = React.useState<Booking[]>(
    [],
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewBookingToDisplayList = (newBooking: Booking) => {
    setBookingsToDisplay([...bookingsToDisplay, newBooking]);
  };

  const handleBookingCancellation = async (
    bookingToDeleteId: string,
  ): Promise<void> => {
    try {
      const remainingBookingsToDisplay = bookingsToDisplay.filter(
        (booking) => booking.bookingId !== bookingToDeleteId,
      );
      setBookingsToDisplay(remainingBookingsToDisplay);
      await Axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/bookings/${bookingToDeleteId}`,
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Could not cancel booking - Please try again", {
        bookingToDeleteId,
      });
    }
  };

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
    getBookings()
      .then((res) => {
        setBookingsToDisplay(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(true);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isError) {
    return <FullPageErrorFallback error={null} />;
  }

  if (isLoading || !bookingsToDisplay) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
        variant="temporary"
      >
        <NewBookingForm
          handleClose={handleClose}
          houses={houses}
          addNewBookingToDisplayList={addNewBookingToDisplayList}
        />
      </Drawer>
      <Typography
        className={classes.title}
        variant="h4"
        align="left"
        gutterBottom
      >
        Your bookings
        <Tooltip
          title="Add"
          aria-label="add"
          placement="right"
          onClick={handleClickOpen}
        >
          <Fab color="primary" size="small">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Typography>

      <GridList cellHeight={180} className={classes.gridList} spacing={15}>
        {bookingsToDisplay.map((booking) => {
          return (
            <GridListTile key={booking.bookingId}>
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
                  <Button
                    size="small"
                    color="primary"
                    fullWidth
                    onClick={() => handleBookingCancellation(booking.bookingId)}
                  >
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
