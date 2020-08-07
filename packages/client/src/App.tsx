import React, { Suspense } from "react";

import { useAuth } from "./contexts/AuthContext";
import { FullPageSpinner } from "./components/FullPageSpinner";

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./AuthenticatedApp"),
);
const UnauthenticatedApp = React.lazy(() => import("./UnauthenticatedApp"));

export const App = () => {
  const { user } = useAuth();
  console.log({ user });
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  );
};
