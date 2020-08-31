import { Context } from "koa";

export const getAccountHouses = (ctx: Context) => {
  const { accountId } = ctx.params;

  console.log(accountId);
};
