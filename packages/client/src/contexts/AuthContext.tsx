import React, { useCallback, useContext, useEffect, useMemo } from "react";
import useSWR from "swr";
import { mutateCallback } from "swr/dist/types";
import { FullPageSpinner } from "../components/FullPageSpinner";
import { AuthClientType, User } from "../utils/authClient";

type AuthContextValue = {
  logout: () => Promise<void>;
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
};

const AuthContext = React.createContext<AuthContextValue>({
  logout: () => Promise.resolve(),
  user: undefined,
  mutate: () => Promise.resolve(undefined),
});
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({
  children,
  authClient,
}: {
  children: React.ReactNode;
  authClient: AuthClientType;
}) => {
  const { data: user, isValidating, mutate, error } = useSWR<User | null>(
    "/accounts/current",
    {
      revalidateOnMount: true,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (user && error && error.response && error.response.status !== 200) {
      mutate(null, false);
    }
  }, [error, mutate, user]);

  const logout = useCallback(async () => {
    await mutate(null, false);
    await authClient.logout();
  }, [authClient, mutate]);

  const value = useMemo(() => ({ user, logout, mutate }), [
    user,
    logout,
    mutate,
  ]);

  if (isValidating || (!user && !error)) {
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
