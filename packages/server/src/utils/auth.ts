import { addDays } from "date-fns";
import { insertAccountSession, retrieveActiveSession } from "../db/sessions";
import { hash, compare } from "bcrypt";
import { AccountFromDB } from "../types/accounts";
import { Session } from "../types/auth";
import { Context } from "koa";
import { config } from "../config";

export const createAccountSession = async (
  accountId: string,
): Promise<string> => {
  const expiryDate = addDays(new Date(), 7);

  const [token] = await insertAccountSession(accountId, expiryDate);

  return token;
};

export const verifySession = async (
  sessionCookie: string,
): Promise<Session> => {
  return retrieveActiveSession(sessionCookie);
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

export const extractSessionId = (ctx: Context): string | null => {
  const sessionCookie = ctx.cookies.get(config.cookies.session);

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie;
};
