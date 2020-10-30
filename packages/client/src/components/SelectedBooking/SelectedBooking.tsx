import React from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";
import FlightLandIcon from "@material-ui/icons/FlightLand";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import FlagIcon from "@material-ui/icons/Flag";
import ChatIcon from "@material-ui/icons/Chat";
import { Booking } from "../../types";
import { formatDate } from "../../utils/calendar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginTop: "60px",
  },
  item: {
    minHeight: 70,
  },
}));

const StyledListItemText = withStyles({
  primary: {
    position: "absolute",
    top: 20,
  },
  secondary: {
    textTransform: "capitalize",
    position: "absolute",
  },
})(ListItemText);

interface Props {
  selectedBooking?: Booking;
}

export const SelectedBooking = ({ selectedBooking }: Props) => {
  const classes = useStyles();

  return (
    <>
      <List className={classes.root}>
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <FlagIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="Status"
            secondary={selectedBooking?.status || ""}
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="Booker Name"
            secondary={
              selectedBooking
                ? `${selectedBooking.firstName} ${selectedBooking?.lastName}`
                : ""
            }
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <FlightLandIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="From"
            secondary={
              selectedBooking
                ? `${formatDate(selectedBooking.arrivalTime)}`
                : ""
            }
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <FlightTakeoffIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="Until"
            secondary={
              selectedBooking
                ? `${formatDate(selectedBooking.departureTime)}`
                : ""
            }
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <PeopleAltRoundedIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="Total number of people"
            secondary={selectedBooking?.companions || ""}
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <ChatIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText
            primary="Booker comments"
            secondary={selectedBooking?.comments || ""}
            primaryTypographyProps={{
              variant: "body2",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "subtitle1",
              color: "textPrimary",
            }}
          />
        </ListItem>
      </List>
    </>
  );
};
