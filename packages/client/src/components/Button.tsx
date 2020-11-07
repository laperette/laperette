import React from "react";
import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
} from "@material-ui/core";

export const Button = ({
  loading = false,
  children,
  ...otherProps
}: ButtonProps & { loading?: boolean }) => {
  return (
    <MuiButton {...otherProps} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : <>{children}</>}
    </MuiButton>
  );
};
