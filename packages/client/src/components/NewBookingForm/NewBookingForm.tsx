import {
  Button,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useBookings } from "../../hooks/useBookings";
import { useHouses } from "../../hooks/useHouses";
import { House, NewBookingData } from "../../types";
import { newBookingFieldsErrorsMapping } from "../../utils/bookings";

interface Props {
  handleCloseDrawer: () => void;

  houses?: House[];
}

const useStyles = makeStyles(() => ({
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

export const NewBookingForm = ({ handleCloseDrawer }: Props) => {
  const classes = useStyles();
  const { houses } = useHouses();
  const { handleBookingCreation } = useBookings({ revalidateOnMount: false });

  const { handleSubmit, setError, errors, control } = useForm<NewBookingData>();

  const onSubmit: SubmitHandler<NewBookingData> = async (data) => {
    try {
      await handleBookingCreation(data);
      handleCloseDrawer();
    } catch (error) {
      setError("departureTime", {
        type: "manual",
        message: newBookingFieldsErrorsMapping.generalInvalidMessage,
      });
      setError("arrivalTime", {
        type: "manual",
        message: newBookingFieldsErrorsMapping.generalInvalidMessage,
      });
      setError("comments", {
        type: "manual",
        message: newBookingFieldsErrorsMapping.generalInvalidMessage,
      });
      setError("companions", {
        type: "manual",
        message: newBookingFieldsErrorsMapping.generalInvalidMessage,
      });
      setError("houseId", {
        type: "manual",
        message: newBookingFieldsErrorsMapping.generalInvalidMessage,
      });
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
          rules={{ required: true }}
          error={!!errors.houseId}
          helperText={
            !!errors.houseId
              ? newBookingFieldsErrorsMapping.generalInvalidMessage
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
          rules={{ required: true }}
          helperText={
            !!errors.companions
              ? newBookingFieldsErrorsMapping.generalInvalidMessage
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
          rules={{ required: true }}
          error={!!errors.comments}
          helperText={
            !!errors.comments
              ? newBookingFieldsErrorsMapping.generalInvalidMessage
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
          rules={{ required: true }}
          error={!!errors.arrivalTime}
          helperText={
            !!errors.arrivalTime
              ? newBookingFieldsErrorsMapping.generalInvalidMessage
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
          rules={{ required: true }}
          error={!!errors.departureTime}
          helperText={
            !!errors.departureTime
              ? newBookingFieldsErrorsMapping.generalInvalidMessage
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
