import React from "react";
import { Grid, Header, Box, Anchor, Main, Text, Button } from "grommet";
import { Home } from "grommet-icons";

import { Calendar } from "./components/Calendar";
import { useAuth } from "./contexts/AuthContext";
import { Switch, Route, Redirect } from "react-router-dom";

const AuthenticatedApp = () => {
  const { user, logout } = useAuth();

  return (
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
            <Text margin={{ left: "small" }} size="large">
              {user?.email}
            </Text>
            <Button onClick={logout} label="logout" />
          </Anchor>
        </Box>
      </Header>
      <Main gridArea="main" background="light-1" pad="medium">
        <Switch>
          <Route path="/calendar">
            <Calendar />
          </Route>
          <Redirect to="/calendar" />
        </Switch>
      </Main>
    </Grid>
  );
};
export default AuthenticatedApp;
