import { Context } from "koa";
import { accountSchema } from "../validation";
import { getAccountByEmail } from "../db/accounts";
export const validateCreateAccountData = async (
  ctx: Context,
  next: () => void,
) => {
  const { error } = accountSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 403;
    ctx.message = "Missing parameters";
    return;
  }

  const { email } = ctx.request.body;

  const alreadyExist = !!(await getAccountByEmail(email));

  if (alreadyExist) {
    ctx.status = 401;
    ctx.message = "Account already exist";
    return;
  }

  return next();
};
