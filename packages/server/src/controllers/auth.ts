import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
import { createUserSession } from "../utils/auth";
import {
  invalidateSessionById,
  getSessionsByUser,
  getSessionsById,
} from "../db/sessions";

export const login = async (ctx: Context) => {
  const { email } = ctx.request.body;
  const account = await getAccountByEmail(email);

  if (!account) {
    ctx.status = 401;
    ctx.body = "Wrong credentials";
    return;
  }

  const { id } = account;

  const sessionId = await createUserSession(id);

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

export const listAccountSessions = async (ctx: Context) => {
  const { accountId } = ctx.params;

  const accountSessions = await getSessionsByUser(accountId);

  ctx.status = 200;
  ctx.body = { sessions: accountSessions };
};
