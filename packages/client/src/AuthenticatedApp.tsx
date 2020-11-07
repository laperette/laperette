import React from "react";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import { Box } from "@material-ui/core";
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
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

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
  const theme = useTheme();
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
      <Box padding={theme.spacing(1)}>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/houses/:houseId/bookings">
            <HouseSpace />
          </Route>
          <Redirect to="/dashboard" />
        </Switch>
      </Box>
    </div>
  );
};
export default AuthenticatedApp;
