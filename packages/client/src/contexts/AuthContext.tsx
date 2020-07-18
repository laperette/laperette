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

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  throw new Error(`Unhandled status: ${status}`);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};
