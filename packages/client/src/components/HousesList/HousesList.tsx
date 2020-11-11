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
import React from "react";
import { Link } from "react-router-dom";
import { useHouses } from "../../hooks/useHouses";
import { FullPageSpinner } from "../FullPageSpinner";

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
  const { houses } = useHouses();
  const classes = useStyles();

  if (!houses) {
    return <FullPageSpinner />;
  }

  return (
    <>
      <Typography variant="h4" align="left" gutterBottom>
        Your houses
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
