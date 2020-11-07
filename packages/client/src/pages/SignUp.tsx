import React, { useCallback, useEffect } from "react";
import {
  Avatar,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Button } from "../components/Button";
import { LockOutlined } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAsync } from "../hooks/useAsync";
import { getAxiosInstance } from "../utils/fetcher";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    marginTop: theme.spacing(3),
  },
}));

const signupDataSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "fr", "eu"] },
    })
    .required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
}).required();

type SignUpData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export const SignUp = () => {
  const { mutate } = useAuth();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<SignUpData>({
    resolver: joiResolver(signupDataSchema),
  });
  const { data, error, isLoading, run } = useAsync<any, AxiosError>();

  const signUp: SubmitHandler<SignUpData> = useCallback(
    (signupData: SignUpData) =>
      run(
        getAxiosInstance()
          .post("/signup", signupData)
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
        Sign up
      </Typography>
      <form onSubmit={handleSubmit(signUp)} className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="given-name"
              fullWidth
              id="firstName"
              inputRef={register({ required: true })}
              label="Firstname"
              name="firstName"
              required
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="family-name"
              fullWidth
              id="lastName"
              inputRef={register({ required: true })}
              label="Lastname"
              name="lastName"
              required
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="current-password"
              fullWidth
              id="password"
              inputRef={register({ required: true })}
              placeholder="Choose a password"
              label="Password"
              name="password"
              required
              type="password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
        </Grid>
        {error?.response?.status === 409 && (
          <Alert severity="error" className={classes.alert}>
            {error?.response?.data}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          loading={isLoading}
        >
          Sign up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link to="/signin" variant="body2" component={RouterLink}>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
