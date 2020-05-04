import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
import { createUserSession } from "../utils/auth";

export const login = async (ctx: Context) => {
  const { email } = ctx.request.body;
  const account = await getAccountByEmail(email);

  if (!account) {
    ctx.status = 401;
    ctx.body = "Wrong credentials";
    return;
  }

  const { id } = account;

  const sessionId = await createUserSession(id);

  ctx.body = {
    sessionId,
  };
};
