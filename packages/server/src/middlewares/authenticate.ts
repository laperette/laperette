import { verifySession, verifyPassword } from "../utils/auth";
import { Context } from "koa";
import { getAccountByEmail } from "../db/accounts";

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

export const extractSessionId = (ctx: Context): string | null => {
  const sessionCookie = ctx.cookies.get("laperette_session");

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie;
};
export const validateCredentials = async (ctx: Context, next: () => void) => {
  const { email, password } = ctx.request.body;

  const account = await getAccountByEmail(email);

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

  ctx.state = {
    accountId: account.id,
  }; // To update to account.account_id when other branched merged

  return next();
};
