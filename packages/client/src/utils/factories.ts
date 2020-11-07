import { AuthClientType, User } from "./authClient";

export const userFactory = ({
  accountId = "accountId",
  email = "email",
  firstName = "firstName",
  lastName = "lastName",
}: Partial<User> = {}): User => ({
  accountId,
  email,
  firstName,
  lastName,
});

export const authClientFactory = ({
  login = async () => userFactory(),
  logout = async () => {},
}: Partial<AuthClientType> = {}): AuthClientType => ({
  login,
  logout,
});
