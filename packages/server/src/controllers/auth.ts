import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
import {
  invalidateSessionById,
  getSessionsByUser,
  getSessionsById,
} from "../db/sessions";
import { createAccountSession } from "../utils/auth";

export const login = async (ctx: Context) => {
  const { accountId } = ctx.state;

  const sessionId = await createAccountSession(accountId);

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
