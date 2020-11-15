import { joiResolver } from "@hookform/resolvers/joi";
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

  const { handleSubmit, errors, control } = useForm<NewBookingData>({
    resolver: joiResolver(bookingSchema),
  });

  const onSubmit: SubmitHandler<NewBookingData> = async (data) => {
    await handleBookingCreation(data);
    handleCloseDrawer();
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
          error={!!errors.departureTime}
          helperText={
            !!errors.departureTime ? errors.departureTime.message : ""
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
