import { extractSessionId, verifySession } from "../utils/auth";
import { Context } from "koa";

export const authenticate = (ctx: Context, next: () => void) => {
  const sessionId = extractSessionId(ctx);

  if (!sessionId) {
    console.warn("Authentication failed", {
      error: { reason: "no_session_id" },
    });
    ctx.body = { error: "Unauthorized", error_description: "no_session_id" };
    ctx.status = 401;
    return;
  }

  const isAuthenticated = verifySession(sessionId);

  // return (await checkToken(token)).fold(
  //   (error) => {
  //     console.warn("Authentication failed", { error });
  //     ctx.body = { error: "Unauthorized", error_description: error.reason };
  //     ctx.status = 401;
  //   },
  //   (user) => {
  //     console.info(`Authentication succeeded`, {
  //       // userId: user.id,
  //     });
  //     return next();
  //   },
  // );

  return next();
};
