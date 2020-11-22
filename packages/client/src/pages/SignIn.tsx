import {
  Avatar,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

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
  const { login, isValidating } = useAuth();
  const { register, handleSubmit } = useForm<Credentials>();
  const classes = useStyles();

  return (
    <>
      <Avatar className={classes.avatar}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form
        onSubmit={handleSubmit(login)}
        className={classes.form}
        noValidate
        data-testid="signin-form"
      >
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
          color="primary"
          className={classes.submit}
          loading={isValidating}
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
