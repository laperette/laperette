import React, { useCallback, useMemo, useContext, useState } from "react";

type AuthFormValues = { email: string; password: string };

type User = {
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (form: AuthFormValues) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
});
AuthContext.displayName = "AuthContext";

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback(({ email }: AuthFormValues) => setUser({ email }), [
    setUser,
  ]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value} {...props} />;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};
