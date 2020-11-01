import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles, Grid, Paper, Box } from "@material-ui/core";
import { Copyright } from "./components/Copyright";
import { SignIn, SignUp } from "./pages";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const UnauthenticatedApp = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      component="main"
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Redirect to="/signin" />
          </Switch>
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default UnauthenticatedApp;
