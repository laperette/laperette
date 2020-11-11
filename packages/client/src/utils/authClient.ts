import { getAxiosInstance } from "./fetcher";

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
  login: async (credentials) =>
    getAxiosInstance()
      .post<{ account: User }>(`/login`, credentials)
      .then(({ data: { account } }) => account),
  logout: async () => getAxiosInstance().post("/logout"),
};

export const fieldsErrorsMapping: { [key: string]: string } = {
  "required": "Ce champ ne peut être vide",
  "wrongEmail": " Cet email est incorrect",
  "wrongPassword": "Ce mot de passe est incorrect",
  "differentPassword": "Les mots de passe sont différents",
  "passwordTooShort": "Le mot de passe doit contenir 6 caractères minimum",
};
