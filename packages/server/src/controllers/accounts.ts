import { Context } from "koa";
import { createOneAccount, getAccountById } from "../db/accounts";
import { hashPassword } from "../utils/auth";

export const createAccount = async (ctx: Context) => {
  try {
    const { firstName, lastName, email, password } = ctx.request.body;

    const hashedPassword = await hashPassword(password);

    await createOneAccount(firstName, lastName, email, hashedPassword);
    ctx.body = {
      status: "ok",
    };
    ctx.status = 201;
  } catch (error) {
    console.log("Error when creating account");
    ctx.status = 500;
    ctx.message = "Error when creating account";
  }
};

export const getAccount = async (ctx: Context) => {
  try {
    const { accountId } = ctx.params;
    const account = await getAccountById(accountId);
    ctx.body = { account };
    ctx.status = 200;
  } catch (error) {
    console.log("Error when fetching account");
    ctx.status = 500;
    ctx.message = "Error when fetching account";
  }
};
