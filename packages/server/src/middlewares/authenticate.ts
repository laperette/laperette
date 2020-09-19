import { verifySession } from "../utils/auth";
import { Context } from "koa";
import { config } from "../config";

export const authenticate = async (ctx: Context, next: () => void) => {
  const sessionId = extractSessionId(ctx);

  if (!sessionId) {
    ctx.status = 401;
    ctx.message = "Unauthorized - No sessionId";
    return;
  }

  const session = await verifySession(sessionId);

  if (!session) {
    ctx.status = 401;
    ctx.message = "Unauthorized - Invalid sessionId";
    return;
  }

  ctx.state.accountId = session.account_id;

  return next();
};

export const extractSessionId = (ctx: Context): string | null => {
  const sessionCookie = ctx.cookies.get(config.cookies.session);

  if (!sessionCookie) {
    return null;
  }

  return sessionCookie;
};
