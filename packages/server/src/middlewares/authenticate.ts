import { verifySession, verifyPassword } from "../utils/auth";
import { Context } from "koa";
import { retrieveAccountByEmail } from "../db/accounts";
import { config } from "../config";
import { serializeAccountForClient } from "../utils/account";

export const extractSessionId = (ctx: Context): string | null => {
  const sessionCookie = ctx.cookies.get(config.cookies.session);

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie;
};

export const authenticate = async (ctx: Context, next: () => void) => {
  const sessionId = extractSessionId(ctx);
  if (!sessionId) {
    ctx.body = { error: "Unauthorized", error_description: "no_session_id" };
    ctx.status = 401;
    return;
  }

  const isAuthenticated = await verifySession(sessionId);

  if (!isAuthenticated) {
    ctx.body = { error: "Unauthorized", error_description: "invalid_session" };
    ctx.status = 401;
    return;
  }

  return next();
};

export const validateCredentials = async (ctx: Context, next: () => void) => {
  const { email, password } = ctx.request.body;

  const account = await retrieveAccountByEmail(email);

  if (!account) {
    ctx.body = { error: "Unauthorized", error_description: "Unknown account" };
    ctx.status = 401;
    return;
  }

  const hasValidPassword = await verifyPassword(account, password);

  if (!hasValidPassword) {
    ctx.body = {
      error: "Unauthorized",
      error_description: "Invalid credentials",
    };
    ctx.status = 401;
    return;
  }

  if (!account.is_member) {
    ctx.body = {
      error: "Unauthorized",
      error_description: "Member validation pending",
    };
    ctx.status = 401;
    return;
  }

  const serializedAccount = serializeAccountForClient(account);

  ctx.state = {
    account: serializedAccount,
  };

  return next();
};
