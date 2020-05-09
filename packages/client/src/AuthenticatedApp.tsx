import React from "react";
import { Grid, Header, Box, Anchor, Main, Text } from "grommet";
import { Home } from "grommet-icons";

import { Calendar } from "./components/Calendar";

const AuthenticatedApp = () => (
  <Grid
    areas={[["header"], ["main"]]}
    fill
    gap={undefined}
    rows={["xxsmall", "1fr"]}
    columns={["1fr"]}
  >
    <Header
      alignContent="center"
      background="brand"
      gridArea="header"
      pad={{ horizontal: "medium" }}
    >
      <Box direction="row">
        <Anchor href="/">
          <Home />
          <Text margin={{ left: "small" }} size="large">
            Laperette
          </Text>
        </Anchor>
      </Box>
    </Header>
    <Main gridArea="main" background="light-1" pad="medium">
      <Calendar />
    </Main>
  </Grid>
);
export default AuthenticatedApp;
