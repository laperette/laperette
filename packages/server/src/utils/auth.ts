import { config } from "../../config";
import { addDays } from "date-fns";
import { saveUserSession, getActiveUserSession } from "../db/sessions";
import { Context } from "koa";
import { v4 as uuidv4 } from "uuid";

export const createUserSession = async (accountId: string): Promise<string> => {
  const token = uuidv4();

  const expiryDate = addDays(new Date(), config.token.expiresIn);

  await saveUserSession(accountId, token, expiryDate);

  return token;
};

export const verifySession = async (
  sessionCookie: string,
): Promise<boolean> => {
  const activeSession = await getActiveUserSession(sessionCookie);

  return !!activeSession.length;
};
