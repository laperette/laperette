import { Context } from "koa";
import { createOneAccount, getAccountById } from "../db/accounts";

export const createAccount = async (ctx: Context) => {
  try {
    const { firstName, lastName, email } = ctx.request.body;
    await createOneAccount(firstName, lastName, email);
  } catch (error) {
    console.log(error);
  }
};

export const getAccount = async (ctx: Context) => {
  try {
    const { accountId } = ctx.params;
    await getAccountById(accountId);
  } catch (error) {
    console.log(error);
  }
};
