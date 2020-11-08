import Axios from "axios";
import React, { useLayoutEffect } from "react";

import { House } from "../../types";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Drawer,
  Fab,
  GridList,
  GridListTile,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Link } from "react-router-dom";
import { NewHouseForm } from "../NewHouseForm";
import useSWR from "swr";

interface Props {
  retrieveHousesForBookingForm: (houses: House[]) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "column",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    font: "sans-serif",
  },
  gridList: {
    width: 500,
    height: 300,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export const HousesList = ({ retrieveHousesForBookingForm }: Props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  if (error) {
    return <FullPageErrorFallback error={error} />;
  }

  if (!houses) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleCloseDrawer}
        variant="temporary"
      >
        <NewHouseForm handleCloseDrawer={handleCloseDrawer} />
      </Drawer>
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        className={classes.title}
      >
        Your houses
        <Tooltip
          title="Add"
          aria-label="add"
          placement="right"
          onClick={handleOpenDrawer}
        >
          <Fab color="primary" size="small">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Typography>
      <GridList cellHeight={180} className={classes.gridList} spacing={15}>
        {houses.map((house) => (
          <GridListTile key={house.houseId}>
            <Card>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  align="center"
                >
                  {house.name}
                </Typography>
              </CardContent>
              <Divider light />
              <CardActions disableSpacing>
                <Button size="small" color="primary" fullWidth>
                  <Link
                    to={`/houses/${house.houseId}/bookings`}
                    style={{ textDecoration: "none" }}
                  >
                    To house space
                  </Link>
                </Button>
              </CardActions>
            </Card>
          </GridListTile>
        ))}
      </GridList>
    </>
  );
};
