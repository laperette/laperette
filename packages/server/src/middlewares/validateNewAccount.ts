import { Context } from "koa";
import { accountSchema } from "../validation";
import { retrieveAccountByEmail } from "../db/accounts";

export const validateCreateAccountData = async (
  ctx: Context,
  next: () => void,
) => {
  const { error } = accountSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.message = "Incorrect parameters";
    return;
  }

  const { email } = ctx.request.body;

  const alreadyExist = !!(await retrieveAccountByEmail(email));

  if (alreadyExist) {
    ctx.status = 409;
    ctx.message = "Account already exists";
    return;
  }

  return next();
};
