import { extractSessionId, verifySession } from "../utils/auth";
import { Context } from "koa";

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
