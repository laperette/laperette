import { getAccountByEmail } from "../db/accounts";
import { Context } from "koa";
import { createToken } from "../utils";

export const login = async (ctx: Context) => {
  const { email } = ctx.request.body;
  const member = await getAccountByEmail(email);
  console.log(member);

  if (!member) {
    ctx.status = 401;
    ctx.body = "Wrong credentials";
    return;
  }

  const { id, createdAt } = member;
  const token = await createToken(id, email, createdAt);

  ctx.body = {
    token,
  };
};

export const extractToken = (ctx: Context): string | null => {
  const { headers } = ctx;
  if (headers && headers.authorization) {
    return headers.authorization.replace("Bearer ", "");
  }
  return null;
};
