import React from "react";
import {
  Button,
  FormControl,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm, OnSubmit, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import Axios from "axios";
import { newHouseFieldsErrorsMapping } from "../../utils/houses";
import { House } from "../../types";

type NewHouseData = { name: string };

interface Props {
  handleClose: () => void;
  addNewHouseToDisplayList: (newHouse: House) => void;
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

export const NewHouseForm = ({
  handleClose,
  addNewHouseToDisplayList,
}: Props) => {
  const classes = useStyles();

  const { handleSubmit, setError, errors, control } = useForm<NewHouseData>();

  const onSubmit: OnSubmit<NewHouseData> = async (data) => {
    try {
      const houseId = uuidv4();
      const newHouse = {
        houseId,
        name: data.name,
      };
      addNewHouseToDisplayList(newHouse);
      await Axios(`${process.env.REACT_APP_SERVER_URL}/houses/house`, {
        method: "post",
        data: newHouse,
        withCredentials: true,
      });
      handleClose();
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
