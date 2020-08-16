import { Context } from "koa";
import { createOneAccount, getAccountById } from "../db/accounts";
import {
  hashPassword,
  createAccountSession,
  verifySession,
} from "../utils/auth";
import { config } from "../config";
import { extractSessionId } from "../middlewares/authenticate";
import { getAccountBySessionId } from "../db/sessions";

export const createAccount = async (ctx: Context) => {
  try {
    const { firstName, lastName, email, password } = ctx.request.body;
    const hashedPassword = await hashPassword(password);

    const [first_name, last_name] = await createOneAccount(
      firstName,
      lastName,
      email,
      hashedPassword,
    );
    ctx.body = {
      status: "ok",
      account: {
        firstName: first_name,
        lastName: last_name,
      },
    };
    ctx.status = 201;
  } catch (error) {
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

export const getCurrentAccount = async (ctx: Context) => {
  try {
    const sessionId = extractSessionId(ctx);

    if (!sessionId) {
      ctx.body = { error: "Unauthorized", error_description: "no_session_id" };
      ctx.status = 401;
      return;
    }

    const isAuthenticated = await verifySession(sessionId);

    if (!isAuthenticated) {
      ctx.body = {
        error: "Unauthorized",
        error_description: "invalid_session",
      };
      ctx.status = 401;
      return;
    }

    const user = await getAccountBySessionId(sessionId);

    if (!user) {
      ctx.body = { error: "Server error", error_description: "no_user_found" };
      ctx.status = 500;
      return;
    }

    ctx.body = {
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
    ctx.status = 200;
    ctx.message = "User authenticated";
  } catch (error) {
    console.log(error);
    console.log("Error when fetching current account");
    ctx.status = 500;
    ctx.message = "Error when fetching current account";
  }
};
