import React from "react";
import {
  Button,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm, OnSubmit, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import Axios from "axios";
import { Booking, House, NewBookingData } from "../../types";
import { createNewDateFromString } from "../../utils/calendar";
import { newBookingFieldsErrorsMapping } from "../../utils/bookings";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  handleClose: () => void;
  addNewBookingToDisplayList: (newBooking: Booking) => void;
  houses?: House[];
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: "20px",
  },
  root: {
    width: "350px",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  field: {
    width: "200px",
    marginBottom: "20px",
  },
}));

export const NewBookingForm = ({
  houses,
  handleClose,
  addNewBookingToDisplayList,
}: Props) => {
  const classes = useStyles();

  const { user } = useAuth();

  const { handleSubmit, setError, errors, control } = useForm<NewBookingData>();

  const onSubmit: OnSubmit<NewBookingData> = async (data) => {
    try {
      const bookingId = uuidv4();
      const newBookingData = {
        bookingId,
        arrivalTime: createNewDateFromString(data.arrivalTime),
        departureTime: createNewDateFromString(data.departureTime),
        comments: data.comments,
        companions: parseInt(data.companions, 10),
      };

      addNewBookingToDisplayList(
        Object.assign(newBookingData, {
          status: "pending",
          firstName: user?.firstName || "User",
          lastName: user?.lastName || "User",
        }),
      );

      await Axios(
        `${process.env.REACT_APP_SERVER_URL}/houses/${data.houseId}/bookings/booking`,
        {
          method: "post",
          data: newBookingData,
          withCredentials: true,
        },
      );
      handleClose();
    } catch (error) {
      setError("departureTime", "generalInvalidMessage");
      setError("arrivalTime", "generalInvalidMessage");
      setError("comments", "generalInvalidMessage");
      setError("companions", "generalInvalidMessage");
      setError("houseId", "generalInvalidMessage");
    }
  };

  return (
    <>
      <Typography
        className={classes.title}
        variant="h5"
        align="center"
        gutterBottom
      >
        Create a new booking
      </Typography>
      <FormControl
        className={classes.root}
        onSubmit={handleSubmit(onSubmit)}
        margin="dense"
        fullWidth
      >
        <Controller
          className={classes.field}
          as={
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="House"
            >
              {houses?.map((house) => {
                return (
                  <MenuItem
                    key={house.houseId}
                    defaultValue=""
                    value={house.houseId}
                  >
                    {house.name}
                  </MenuItem>
                );
              })}
            </Select>
          }
          variant="outlined"
          label="House"
          name="houseId"
          control={control}
          error={!!errors.houseId}
          helperText={
            !!errors.houseId
              ? newBookingFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
          defaultValue=""
        />
        <Controller
          className={classes.field}
          as={TextField}
          variant="outlined"
          label="Number of people"
          name="companions"
          control={control}
          error={!!errors.companions}
          helperText={
            !!errors.companions
              ? newBookingFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
          defaultValue=""
        />
        <Controller
          className={classes.field}
          as={TextField}
          variant="outlined"
          label="Comments"
          name="comments"
          control={control}
          error={!!errors.comments}
          helperText={
            !!errors.comments
              ? newBookingFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
          defaultValue=""
        />
        <Controller
          className={classes.field}
          as={TextField}
          variant="outlined"
          label="Arrival Date"
          name="arrivalTime"
          control={control}
          error={!!errors.arrivalTime}
          helperText={
            !!errors.arrivalTime
              ? newBookingFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
          placeholder="dd/mm/yyyy"
          defaultValue=""
        />
        <Controller
          className={classes.field}
          as={TextField}
          variant="outlined"
          label="Departure Date"
          name="departureTime"
          control={control}
          error={!!errors.departureTime}
          helperText={
            !!errors.departureTime
              ? newBookingFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
          placeholder="dd/mm/yyyy"
          defaultValue=""
        />

        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </Button>
      </FormControl>
    </>
  );
};
