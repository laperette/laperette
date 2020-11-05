import React from "react";
import { Main } from "grommet";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";

import { useAuth } from "./contexts/AuthContext";
import { Switch, Route, Redirect } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { HouseSpace } from "./pages/HouseSpace";

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const AuthenticatedApp = () => {
  const { logout } = useAuth();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            href="/dashboard"
          >
            <HomeRoundedIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            La Perette
          </Typography>
          <Button onClick={logout} color={"inherit"}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Main gridArea="main" background="light-1" pad="medium">
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/houses/:houseId/bookings">
            <HouseSpace />
          </Route>
          <Redirect to="/dashboard" />
        </Switch>
      </Main>
    </div>
  );
};
export default AuthenticatedApp;
