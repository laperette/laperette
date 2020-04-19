import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {data ? JSON.stringify(data) : "loading..."}
        <Calendar />
      </header>
    </div>
  );
};

export default App;
