import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grommet, Text, Header, Main, Box, Grid, Anchor } from "grommet";
import { Home, Sync } from "grommet-icons";

import { Calendar, Booking } from "./Calendar/Calendar";
import { theme } from "./theme";

const App = () => {
  const [bookings, setBookings] = useState<ReadonlyArray<Booking> | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookings`,
      );
      setBookings(response.data);
    };
    getBookings();
  }, []);

  return (
    <Grommet theme={theme}>
      <Box height="100vh" background="light-1">
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
            {bookings === null ? (
              <Box fill justify="center" align="center">
                <Text size="xxlarge">
                  <Sync /> loading...
                </Text>
              </Box>
            ) : (
              <Calendar bookings={bookings} />
            )}
          </Main>
        </Grid>
      </Box>
    </Grommet>
  );
};

export default App;
