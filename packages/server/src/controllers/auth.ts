import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
import { createToken, saveToken } from "../utils/auth";

export const login = async (ctx: Context) => {
  const { email } = ctx.request.body;
  const account = await getAccountByEmail(email);

  if (!account) {
    ctx.status = 401;
    ctx.body = "Wrong credentials";
    return;
  }

  const { id, createdAt } = account;
  const token = await createToken(id, email, createdAt);
  await saveToken(token, id);
  ctx.body = {
    token,
  };
};
