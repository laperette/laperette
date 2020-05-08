import { config } from "../../config";
import { addDays } from "date-fns";
import { saveAccountSession, getActiveAccountSession } from "../db/sessions";
<<<<<<< HEAD
=======
import { Context } from "koa";
>>>>>>> Created middleware to validate credentials + Added password hashing and insertion into DB
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcrypt";

export const createAccountSession = async (
  accountId: string,
): Promise<string> => {
  const token = uuidv4();

  const expiryDate = addDays(new Date(), config.token.expiresIn);

  await saveAccountSession(accountId, token, expiryDate);

  return token;
};

export const verifySession = async (
  sessionCookie: string,
): Promise<boolean> => {
  const activeSession = await getActiveAccountSession(sessionCookie);

  return !!activeSession.length;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

export const verifyPassword = async (
  account,
  password: string,
): Promise<string> => {
  const storedPassword = account.password;

  const isValidPassword = await compare(password, storedPassword);

  return isValidPassword;
};
