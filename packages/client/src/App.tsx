import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "./Calendar/Calendar";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getHelloWorld = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/healthz`,
      );
      setData(response.data);
    };
    getHelloWorld();
  }, []);

  return (
    <div>
      {data ? JSON.stringify(data) : "loading..."}
      <Calendar />
    </div>
  );
};

export default App;
