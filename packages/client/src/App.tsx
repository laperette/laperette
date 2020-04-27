import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Booking } from "./Calendar/Calendar";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

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
    <>
      <GlobalStyle />
      <Container>
        {bookings === null ? "loading..." : <Calendar bookings={bookings} />}
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  padding: 24px;
`;

export default App;
