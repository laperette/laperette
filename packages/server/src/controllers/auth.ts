import { Context } from "koa";
import {
  invalidateSessionById,
  getSessionsByUser,
  getSessionsById,
} from "../db/sessions";
import { createAccountSession } from "../utils/auth";
import { config } from "../config";
import { extractSessionId } from "../middlewares/authenticate";

export const login = async (ctx: Context) => {
  const { account } = ctx.state;

  const sessionId = await createAccountSession(account.accountId);

  ctx.cookies.set(config.cookies.session, sessionId);
  ctx.status = 200;
  ctx.body = {
    status: "ok",
    account: {
      firstName: account.firstName,
      lastName: account.lastName,
    },
  };
};

export const revokeAccountSessionById = async (ctx: Context) => {
  const sessionId = extractSessionId(ctx);

  const doesSessionExist = (await getSessionsById(sessionId)).length;

  if (!doesSessionExist) {
    ctx.status = 404;
    ctx.message = "Session does not exist";
    return;
  }

  await invalidateSessionById(sessionId);

  ctx.cookies.set(config.cookies.session, "");
  ctx.status = 204;
};

export const listAccountSessions = async (ctx: Context) => {
  const { accountId } = ctx.params;

  const accountSessions = await getSessionsByUser(accountId);

  ctx.status = 200;
  ctx.body = { sessions: accountSessions };
};
