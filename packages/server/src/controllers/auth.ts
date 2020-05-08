import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
<<<<<<< HEAD
import {
  invalidateSessionById,
  getSessionsByUser,
  getSessionsById,
} from "../db/sessions";
=======
>>>>>>> Created middleware to validate credentials + Added password hashing and insertion into DB
import { createAccountSession } from "../utils/auth";

export const login = async (ctx: Context) => {
  const { accountId } = ctx.state;

  const sessionId = await createAccountSession(accountId);
<<<<<<< HEAD

  ctx.status = 200;
  ctx.body = {
    sessionId,
  };
};

export const revokeAccountSessionById = async (ctx: Context) => {
  const { sessionId } = ctx.params;

  const sessionExist = (await getSessionsById(sessionId)).length;

  if (!sessionExist) {
    ctx.status = 404;
    ctx.message = "Session does not exist";
    return;
  }

  await invalidateSessionById(sessionId);

  ctx.status = 204;
};
=======
>>>>>>> Created middleware to validate credentials + Added password hashing and insertion into DB

export const listAccountSessions = async (ctx: Context) => {
  const { accountId } = ctx.params;

  const accountSessions = await getSessionsByUser(accountId);

  ctx.status = 200;
  ctx.body = { sessions: accountSessions };
};
