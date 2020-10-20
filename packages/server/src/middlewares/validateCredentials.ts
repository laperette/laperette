import { Context } from "koa";
import { retrieveAccountByEmail } from "../db/accounts";
import { verifyPassword } from "../utils/auth";
import { serializeAccountForClient } from "../utils/account";

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

  const serializedAccount = serializeAccountForClient(account);

  ctx.state = {
    account: serializedAccount,
  };

  return next();
};
