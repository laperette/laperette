export type AuthClient = {
  fetchUser: () => Promise<{ user: User | null }>;
  login: (credentials: Credentials) => Promise<User>;
  logout: () => Promise<void>;
};

export type Credentials = { email: string; password: string };

export type User = {
  email: string;
};

export const fakeAuthClient = ({
  fetchUser = () => Promise.resolve({ user: null }),
  login = ({ email }) => Promise.resolve({ email }),
  logout = () => Promise.resolve(),
}: Partial<AuthClient> = {}): AuthClient => ({
  login,
  logout,
  fetchUser,
});

export const userFactory = ({
  email = "email@email.fr",
}: Partial<User> = {}): User => ({ email });
