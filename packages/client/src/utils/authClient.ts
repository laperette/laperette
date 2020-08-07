import Axios from "axios";

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
  firstName: string;
  lastName: string;
};

export const AuthClient = ({
  fetchUser = () => {
    return Axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/accounts/current`,
      withCredentials: true,
    }).then((res) =>
      Promise.resolve(res.data).catch(() => Promise.reject(null)),
    );
  },
  login = ({ email, password }) => {
    return Axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/login`,
      data: { email, password },
      withCredentials: true,
    })
      .then((result) =>
        Promise.resolve({
          firstName: result.data.account.firstName,
          lastName: result.data.account.lastName,
        }),
      )
      .catch(() => Promise.reject());
  },
  logout = async () => {
    return Axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/logout`,
      withCredentials: true,
    })
      .then(() => Promise.resolve())
      .catch(() => Promise.reject());
  },
  signup = ({ firstName, lastName, email, password }) => {
    return Axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/signup`,
      data: { firstName, lastName, email, password },
    })
      .then((result) =>
        Promise.resolve({
          firstName: result.data.account.firstName,
          lastName: result.data.account.lastName,
        }),
      )
      .catch(() => Promise.reject());
  },
}: Partial<AuthClient> = {}): AuthClient => ({
  fetchUser,
  login,
  logout,
  signup,
});
