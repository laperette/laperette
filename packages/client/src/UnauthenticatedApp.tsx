import React from "react";

import { Login } from "./components/Login";
import { Switch, Route, Redirect } from "react-router-dom";
import { Signup } from "./components/Signup";
import { PendingValidation } from "./pages/PendingValidation/PendingValidation";

const UnauthenticatedApp = () => (
  <Switch>
    <Route path="/login">
      <Login />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Route path="/pending-validation">
      <PendingValidation />
    </Route>
    <Redirect to="/login" />
  </Switch>
);

export default UnauthenticatedApp;
