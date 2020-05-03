import { extractSessionId, verifySession } from "../utils/auth";
import { Context } from "koa";

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
