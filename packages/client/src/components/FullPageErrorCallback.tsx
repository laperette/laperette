import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
});

export const FullPageErrorFallback = ({ error }: { error: Error | null }) => {
  const styles = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      className={styles.root}
    >
      <Typography variant="h5" paragraph>
        Uh oh... There's a problem. Try refreshing the app.
      </Typography>
      <Typography variant="caption">{error?.message}</Typography>
    </Grid>
  );
};
