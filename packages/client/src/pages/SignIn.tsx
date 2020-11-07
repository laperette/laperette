import React, { useCallback, useEffect } from "react";
import {
  Avatar,
  TextField,
  Link,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { Button } from "../components/Button";
import { useAsync } from "../hooks/useAsync";
import { useAuth } from "../contexts/AuthContext";
import { getAxiosInstance } from "../utils/fetcher";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type Credentials = { email: string; password: string };

export const SignIn = () => {
  const { mutate } = useAuth();
  const classes = useStyles();
  const { register, handleSubmit } = useForm<Credentials>();
  const { data, isLoading, run } = useAsync<any, AxiosError>();

  const signIn: SubmitHandler<Credentials> = useCallback(
    (credentials) =>
      run(
        getAxiosInstance()
          .post("/login", credentials)
          .then((res) => res.data),
      ),
    [run],
  );

  useEffect(() => {
    if (data) {
      mutate(data, false);
    }
  }, [data, mutate]);

  return (
    <>
      <Avatar className={classes.avatar}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit(signIn)} className={classes.form} noValidate>
        <TextField
          autoComplete="email"
          autoFocus
          fullWidth
          id="email"
          inputRef={register({ required: true })}
          label="Email"
          margin="normal"
          name="email"
          required
          type="email"
          variant="outlined"
        />
        <TextField
          autoComplete="current-password"
          fullWidth
          id="password"
          inputRef={register({ required: true })}
          label="password"
          margin="normal"
          name="password"
          required
          type="password"
          variant="outlined"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          loading={isLoading}
        >
          Log in
        </Button>
        <Grid container>
          <Grid item>
            Need an account?{" "}
            <Link to="/signup" variant="body2" component={RouterLink}>
              Sign up
            </Link>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
