import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useBookings } from "../../hooks/useBookings";
import { useHouses } from "../../hooks/useHouses";
import { House, NewBookingData } from "../../types";
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

  const [serverError, setServerError] = useState<boolean>(false);

  const { handleSubmit, errors, control } = useForm<NewBookingData>({
    resolver: joiResolver(bookingSchema),
  });

  const onSubmit: SubmitHandler<NewBookingData> = async (data) => {
    try {
      await handleBookingCreation(data);
      handleCloseDrawer();
    } catch (error) {
      setServerError(true);
    }
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
        className={classes.field}
        as={TextField}
        variant="outlined"
        label="Arrival Date"
        name="arrivalTime"
        control={control}
        rules={{ required: true }}
        error={!!errors.arrivalTime}
        helperText={!!errors.arrivalTime ? errors.arrivalTime.message : ""}
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
        helperText={!!errors.departureTime ? errors.departureTime.message : ""}
        placeholder="dd/mm/yyyy"
        defaultValue=""
      />
      {serverError ? (
        <>
          <Typography variant="subtitle1" align="center" color="error">
            Sorry a problem happened
          </Typography>
          <Typography variant="subtitle1" align="center" color="error">
            Please try again
          </Typography>
        </>
      ) : (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </Button>
      )}
    </form>
  );
};
