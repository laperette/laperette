import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
