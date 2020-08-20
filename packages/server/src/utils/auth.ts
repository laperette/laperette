import { addDays } from "date-fns";
import { insertAccountSession, retrieveActiveSession } from "../db/sessions";
import { hash, compare } from "bcrypt";

export const createAccountSession = async (
  accountId: string,
): Promise<string> => {
  const expiryDate = addDays(new Date(), 30);

  const token = await insertAccountSession(accountId, expiryDate);

  return token;
};

export const verifySession = async (
  sessionCookie: string,
): Promise<boolean> => {
  const activeSession = await retrieveActiveSession(sessionCookie);
  return !!activeSession;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

export const verifyPassword = async (
  account: any,
  password: string,
): Promise<boolean> => {
  const storedPassword = account.password;

  const isValidPassword = await compare(password, storedPassword);

  return isValidPassword;
};
