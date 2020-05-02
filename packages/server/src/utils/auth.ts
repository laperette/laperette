import { config } from "../../config";
import { addDays } from "date-fns";
import { saveUserSession, getActiveUserSessions } from "../db/sessions";
import { Context } from "koa";
import { v4 as uuidv4 } from "uuid";

export const createUserSession = async (accountId: string) => {
  const token = uuidv4();

  const expiryDate = addDays(new Date(), config.token.expiresIn);

  await saveUserSession(accountId, token, expiryDate);

  return token;
};

export const extractSessionId = (ctx: Context): string | null => {
  const { headers } = ctx;
  if (!headers || !headers.authorization) {
    return null;
  }

  console.log(headers.authorization.replace);
  const sessionId = headers.authorization.replace("Bearer ", "");

  return sessionId;
};

export const verifySession = async (sessionToken: string) => {
  const session = await getActiveUserSessions(sessionToken);

  console.log({ session });

  // return session
  //   .map(({ user, session }) => {
  //     return {
  //       user: rowToRecord(user),
  //       sub: user.auth0_id,
  //       iat: asUnixSecondsTimestamp(session.created_at),
  //       exp: asUnixSecondsTimestamp(session.expires_at),
  //       iss: "bulb.co.uk",
  //     };
  //   })
  //   .getOrElse(null);

  // await getActiveSessionToek;
};
