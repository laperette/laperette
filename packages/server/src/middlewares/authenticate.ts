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
    ctx.status = 401;
    ctx.message = "Unauthorized - No sessionId";
    return;
  }

  const isAuthenticated = await verifySession(sessionId);

  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.message = "Unauthorized - Invalid sessionId";
    return;
  }

  return next();
};

export const validateCredentials = async (ctx: Context, next: () => void) => {
  const { email, password } = ctx.request.body;

  const account = await retrieveAccountByEmail(email);

  if (!account) {
    ctx.status = 401;
    ctx.message = "Unauthorized";
    return;
  }

  const hasValidPassword = await verifyPassword(account, password);

  if (!hasValidPassword) {
    ctx.status = 401;
    ctx.message = "Unauthorized";
    return;
  }

  if (!account.is_member) {
    ctx.status = 401;
    ctx.message = "Unauthorized - Membership validation pending";
    return;
  }

  const serializedAccount = serializeAccountForClient(account);

  ctx.state = {
    account: serializedAccount,
  };

  return next();
};
