import React from "react";

import { Login } from "./components/Login";
import { Switch, Route, Redirect } from "react-router-dom";
import { Signup } from "./components/Signup";

const UnauthenticatedApp = () => (
  <Switch>
    <Route path="/login">
      <Login />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Redirect to="/login" />
  </Switch>
);

export default UnauthenticatedApp;
