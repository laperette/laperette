import { addDays } from "date-fns";
import { insertAccountSession, retrieveActiveSession } from "../db/sessions";
import { hash, compare } from "bcrypt";
import { AccountFromDB } from "../types/accounts";
import { Session } from "../types/auth";

export const createAccountSession = async (
  accountId: string,
): Promise<string> => {
  const expiryDate = addDays(new Date(), 7);

  const token = await insertAccountSession(accountId, expiryDate);

  return token;
};

export const verifySession = async (
  sessionCookie: string,
): Promise<Session> => {
  const activeSession = await retrieveActiveSession(sessionCookie);
  return activeSession;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

export const verifyPassword = async (
  account: AccountFromDB,
  password: string,
): Promise<boolean> => {
  const storedPassword = account.password;

  const isValidPassword = await compare(password, storedPassword);

  return isValidPassword;
};
