import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          backgroundColor: "rgb(245, 245, 245);",
        },
        body: {
          backgroundColor: "rgb(245, 245, 245);",
        },
      },
    },
  },
});
