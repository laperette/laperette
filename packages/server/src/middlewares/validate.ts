import { Context } from "koa";
import { accountSchema } from "../validation";
export const validateCreateAccountBody = (ctx: Context, next: () => void) => {
  const { error } = accountSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 403;
    ctx.body = "Missing parameters";
    return;
  }
  return next();
};
