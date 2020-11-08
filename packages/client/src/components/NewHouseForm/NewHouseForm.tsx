import React from "react";
import {
  Button,
  FormControl,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm, OnSubmit, Controller } from "react-hook-form";

import Axios from "axios";
import { newHouseFieldsErrorsMapping } from "../../utils/houses";

interface Props {
  handleCloseDrawer: () => void;
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

export const NewHouseForm = ({ handleCloseDrawer }: Props) => {
  const classes = useStyles();

  const { handleSubmit, setError, errors, control } = useForm<NewHouseData>();

  const onSubmit: OnSubmit<NewHouseData> = async (data) => {
    try {
      await Axios(`${process.env.REACT_APP_SERVER_URL}/houses/house`, {
        method: "post",
        data: {
          name: data.name,
        },
        withCredentials: true,
      });
      handleCloseDrawer();
    } catch (error) {
      setError("name", "wrongHouseName");
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
          helperText={
            !!errors.name
              ? newHouseFieldsErrorsMapping["generalInvalidMessage"]
              : ""
          }
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
