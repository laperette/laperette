import Axios from "axios";
import React, { useLayoutEffect } from "react";

import { useAsync } from "../../hooks/useAsync";
import { House } from "../../types";
import { FullPageErrorFallback } from "../FullPageErrorCallback";
import { FullPageSpinner } from "../FullPageSpinner";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  GridList,
  GridListTile,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

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
}));

export const HousesList = () => {
  const { data: houses, run, isIdle, isLoading, isError, error } = useAsync<
    House[] | null
  >();
  const classes = useStyles();

  useLayoutEffect(() => {
    const getHouses = async (): Promise<House[]> => {
      const response = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/houses`,
        {
          withCredentials: true,
        },
      );

      if (!response?.data || !response?.data?.houses.length) {
        return [];
      }

      return response.data.houses;
    };
    run(getHouses());
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isIdle || isLoading || !houses) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Typography variant="h4" align="left" gutterBottom>
        Your houses
      </Typography>
      <GridList cellHeight={180} className={classes.gridList} spacing={15}>
        {houses.map((house) => (
          <GridListTile>
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
