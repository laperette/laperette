import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  FormControl,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useHouses } from "../../hooks/useHouses";
import { NewHouseData } from "../../types";
import { houseSchema } from "../../utils/formValidation";

interface Props {
  handleCloseDrawer: () => void;
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

export const NewHouseForm = ({ handleCloseDrawer }: Props) => {
  const classes = useStyles();

  const { handleSubmit, setError, errors, control } = useForm<NewHouseData>({
    resolver: joiResolver(houseSchema),
  });
  const { handleHouseCreation } = useHouses({ revalidateOnMount: false });

  const onSubmit: SubmitHandler<NewHouseData> = async (data) => {
    try {
      await handleHouseCreation(data);
      handleCloseDrawer();
    } catch (error) {
      setError("name", { message: "A problem happened, please try again" });
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
        Create a new house
      </Typography>
      <FormControl
        className={classes.root}
        onSubmit={handleSubmit(onSubmit)}
        margin="dense"
        fullWidth
      >
        <Controller
          className={classes.field}
          as={TextField}
          variant="outlined"
          label="House name"
          name="name"
          control={control}
          error={!!errors.name}
          helperText={!!errors.name ? errors.name.message : ""}
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
