import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { AppProviders } from "./contexts/AppProviders";
import { AuthClient } from "./utils/authClient";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders authClient={AuthClient()}>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
