import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { format } from "date-fns";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useBookings } from "../../hooks/useBookings";
import { useHouses } from "../../hooks/useHouses";
import { House, NewBookingData } from "../../types";
import { createNewDateFromString } from "../../utils/calendar";
import { bookingSchema } from "../../utils/formValidation";

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
    flexDirection: "column",
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

  const [isArrivalDatePickerOpen, setIsArrivalDatePickerOpen] = useState<
    boolean
  >(false);
  const [isDepartureDatePickerOpen, setIsDepartureDatePickerOpen] = useState<
    boolean
  >(false);
  const { handleSubmit, errors, control, watch } = useForm<NewBookingData>({
    resolver: joiResolver(bookingSchema),
  });

  const onSubmit: SubmitHandler<NewBookingData> = async (data) => {
    await handleBookingCreation(data);
    handleCloseDrawer();
  };

  return (
    <form className={classes.root}>
      <Typography
        className={classes.title}
        variant="h5"
        align="center"
        gutterBottom
      >
        Create a new booking
      </Typography>
      <Controller
        className={classes.field}
        as={
          <TextField id="house-select" label="House" select variant="outlined">
            {houses?.map((house) => {
              return (
                <MenuItem key={house.houseId} value={house.houseId}>
                  {house.name}
                </MenuItem>
              );
            })}
          </TextField>
        }
        name="houseId"
        control={control}
        rules={{ required: true }}
        error={!!errors.houseId}
        helperText={!!errors.houseId ? errors.houseId.message : ""}
        defaultValue=""
      />
      <Controller
        className={classes.field}
        as={TextField}
        variant="outlined"
        label="Number of people"
        name="companions"
        control={control}
        rules={{ required: true }}
        error={!!errors.companions}
        helperText={!!errors.companions ? errors.companions.message : ""}
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
        helperText={!!errors.comments ? errors.comments.message : ""}
        defaultValue=""
      />
      <Controller
        name="arrivalTime"
        control={control}
        rules={{ required: true }}
        defaultValue=""
        render={({ ref, onChange, value, ...props }) => (
          <KeyboardDatePicker
            className={classes.field}
            autoOk
            inputVariant="outlined"
            variant="inline"
            format="dd/MM/yyyy"
            label="Arrival Date"
            error={!!errors.arrivalTime}
            helperText={!!errors.arrivalTime ? errors.arrivalTime.message : ""}
            open={isArrivalDatePickerOpen}
            onOpen={() => setIsArrivalDatePickerOpen(true)}
            onClose={() => setIsArrivalDatePickerOpen(false)}
            onClick={() => setIsArrivalDatePickerOpen(true)}
            onChange={(date) => date && onChange(format(date, "dd/MM/yyyy"))}
            value={value ? createNewDateFromString(value) : null}
            inputRef={ref}
            minDate={new Date()}
            {...props}
          />
        )}
      />
      <Controller
        name="departureTime"
        control={control}
        rules={{ required: true }}
        defaultValue=""
        render={({ ref, onChange, value, ...props }) => (
          <KeyboardDatePicker
            className={classes.field}
            autoOk
            inputVariant="outlined"
            variant="inline"
            format="dd/MM/yyyy"
            label="Departure Date"
            error={!!errors.departureTime}
            helperText={
              !!errors.departureTime ? errors.departureTime.message : ""
            }
            open={isDepartureDatePickerOpen}
            onOpen={() => setIsDepartureDatePickerOpen(true)}
            onClose={() => setIsDepartureDatePickerOpen(false)}
            onClick={() => setIsDepartureDatePickerOpen(true)}
            onChange={(date) => date && onChange(format(date, "dd/MM/yyyy"))}
            value={value ? createNewDateFromString(value) : null}
            inputRef={ref}
            minDate={
              watch("arrivalTime")
                ? createNewDateFromString(watch("arrivalTime"))
                : new Date()
            }
            {...props}
          />
        )}
      />
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleSubmit(onSubmit)}
      >
        Create
      </Button>
    </form>
  );
};
