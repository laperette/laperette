import {
  AppBar,
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import React, { useState } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
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
  const { logout, user } = useAuth();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null,
  );
  const handleProfileMenuOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "account-menu";
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            component={Link}
            to="/dashboard"
          >
            <HomeRoundedIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            La Perette
          </Typography>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar>{`${user?.firstName?.[0]}${user?.lastName?.[0]}`}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id={menuId}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuItem button={false} autoFocus={false}>
              <ListItemIcon>
                <Avatar>{`${user?.firstName?.[0]}${user?.lastName?.[0]}`}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={`${user?.firstName} ${user?.lastName}`}
                secondary={user?.email}
              />
            </MenuItem>
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
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
