import React from "react";
import { CircularProgress, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
});

export const FullPageSpinner = () => {
  const styles = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={styles.root}
    >
      <CircularProgress />
    </Grid>
  );
};
