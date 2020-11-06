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
import React from "react";
import { useBookings } from "../../hooks/useBookings";
import { House } from "../../types";
import { formatDate } from "../../utils/calendar";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
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

  const { data: bookings, error } = useBookings();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (error) {
    return <FullPageErrorFallback error={error} />;
  }
  if (!bookings) {
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
        <NewBookingForm handleClose={handleClose} houses={houses} />
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
        {bookings.map((booking) => {
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
