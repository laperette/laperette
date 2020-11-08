import React, { useCallback, useContext, useEffect, useMemo } from "react";
import useSWR from "swr";
import { mutateCallback } from "swr/dist/types";
import { FullPageSpinner } from "../components/FullPageSpinner";
import { AuthClientType, User, Credentials } from "../utils/authClient";

type AuthContextValue = {
  logout: () => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  user?: User | null;
  mutate: (
    data?:
      | User
      | Promise<User | null>
      | mutateCallback<User | null>
      | null
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<User | undefined | null>;
  isValidating: boolean;
};

const AuthContext = React.createContext<AuthContextValue>({
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
  user: undefined,
  mutate: () => Promise.resolve(undefined),
  isValidating: false,
});
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClientType;
}) => {
  const {
    data: user,
    isValidating,
    mutate,
    error,
    revalidate,
  } = useSWR<User | null>("/accounts/current", {
    revalidateOnMount: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (user && error && error.response && error.response.status !== 200) {
      mutate(null, false);
    }
  }, [error, mutate, user]);

  const logout = useCallback(async () => {
    await authClient.logout();
    await mutate(null, true);
  }, [authClient, mutate]);

  const login = useCallback(
    async (credentials: Credentials) => {
      await authClient.login(credentials);
      await revalidate();
    },
    [authClient, revalidate],
  );

  const value = useMemo(() => ({ user, logout, mutate, login, isValidating }), [
    user,
    logout,
    mutate,
    login,
    isValidating,
  ]);

  if (isValidating) {
    return <FullPageSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return value;
};
