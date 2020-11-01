import { axios } from "./fetcher";

export type AuthClientType = {
  login: (credentials: Credentials) => Promise<User | null>;
  logout: () => Promise<void>;
};

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type User = {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export const AuthClient: AuthClientType = {
  login: async ({ email, password }) => {
    const { data, status } = await axios.post(
      `/login`,
      { email, password },
      {
        validateStatus: (status) => status <= 200 || status === 401,
      },
    );
    if (status === 401) {
      return null;
    }
    return {
      accountId: data.account.accountId,
      firstName: data.account.firstName,
      lastName: data.account.lastName,
      email: data.account.email,
    };
  },
  logout: async () => axios.get("/logout"),
};

export const fieldsErrorsMapping: { [key: string]: string } = {
  "required": "Ce champ ne peut être vide",
  "wrongEmail": " Cet email est incorrect",
  "wrongPassword": "Ce mot de passe est incorrect",
  "differentPassword": "Les mots de passe sont différents",
  "passwordTooShort": "Le mot de passe doit contenir 6 caractères minimum",
};
