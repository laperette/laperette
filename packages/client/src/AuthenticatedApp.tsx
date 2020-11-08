import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { HouseSpace } from "./pages/HouseSpace";

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
    main: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
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
      <main className={classes.main}>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/houses/:houseId/bookings">
            <HouseSpace />
          </Route>
          <Redirect to="/dashboard" />
        </Switch>
      </main>
    </div>
  );
};
export default AuthenticatedApp;
