import React, {
  useCallback,
  useMemo,
  useContext,
  useLayoutEffect,
} from "react";
import { User, AuthClient, Credentials } from "../utils/authClient";
import { useAsync } from "../hooks/useAsync";
import { FullPageSpinner } from "../components/FullPageSpinner";
import { FullPageErrorFallback } from "../components/FullPageErrorCallback";
import UnauthenticatedApp from "../UnauthenticatedApp";
// import { useCookies } from "react-cookie";
type AuthContextValue = {
  user: User | null;
  login: (form: Credentials) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
});
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClient;
}) => {
  const {
    data,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync<{ user: User }>();

  useLayoutEffect(() => {
    run(authClient.fetchUser());
  }, [run, authClient]);

  const login = useCallback(
    async (credentials: Credentials) => {
      const user = await authClient.login(credentials);
      setData({ user });
    },
    [setData, authClient],
  );

  const logout = useCallback(async () => {
    await authClient.logout();
    setData(null);
  }, [setData, authClient]);

  const user = data?.user ?? null;

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  // Normally provider components render the context provider with a value.
  // But we postpone rendering any of the children until after we've determined
  // whether or not we have a user and we render a spinner
  // while we go retrieve that user's information.
  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isSuccess || isError) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  throw new Error(`Unhandled status: ${status}`);
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return value;
};
