import { extractToken } from "../controllers/auth";

export const authenticate = () => async (ctx, next) => {
  const token = extractToken(ctx);

  if (!token) {
    console.warn("Authentication failed", {
      error: { reason: "no_token" },
    });
    ctx.body = { error: "Unauthorized", error_description: "no_token" };
    ctx.status = 401;
    return;
  }

  return (await checkToken(token)).fold(
    (error) => {
      console.warn("Authentication failed", { error });
      ctx.body = { error: "Unauthorized", error_description: error.reason };
      ctx.status = 401;
    },
    (user) => {
      console.info(`Authentication succeeded`, {
        // userId: user.id,
      });
      return next();
    },
  );
};
