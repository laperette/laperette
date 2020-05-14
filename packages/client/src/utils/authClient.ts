export type AuthClient = {
  fetchUser: () => Promise<{ user: User } | null>;
  login: (credentials: Credentials) => Promise<User>;
  logout: () => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<User>;
};

export type Credentials = { email: string; password: string };
export type SignUpCredentials = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
export type User = {
  email: string;
};

export const fakeAuthClient = ({
  fetchUser = () => Promise.resolve(null),
  login = ({ email }) => Promise.resolve({ email }),
  logout = () => Promise.resolve(),
  signup = ({ email }) => Promise.resolve({ email }),
}: Partial<AuthClient> = {}): AuthClient => ({
  fetchUser,
  login,
  logout,
  signup,
});

export const userFactory = ({
  email = "email@email.fr",
}: Partial<User> = {}): User => ({ email });
