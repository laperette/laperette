import { Context } from "koa";
import { createOneAccount, getAccountById } from "../db/accounts";

export const createAccount = async (ctx: Context) => {
  try {
    const { firstName, lastName, email } = ctx.request.body;
    await createOneAccount(firstName, lastName, email);
    ctx.body = {
      status: "ok",
    };
    ctx.status = 201;
  } catch (error) {
    console.log(error);
  }
};

export const getAccount = async (ctx: Context) => {
  try {
    const { accountId } = ctx.params;
    const account = await getAccountById(accountId);
    ctx.body = { account };
    ctx.status = 200;
  } catch (error) {
    console.log(error);
  }
};
