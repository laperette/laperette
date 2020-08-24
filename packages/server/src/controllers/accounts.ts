import { Context } from "koa";
import { insertOneAccount, retrieveAccountById } from "../db/accounts";
import { hashPassword, verifySession } from "../utils/auth";
import { extractSessionId } from "../middlewares/authenticate";
import { retrieveAccountBySessionId } from "../db/sessions";
import { serializeAccountForClient } from "../utils/account";

export const createAccount = async (ctx: Context) => {
  const { firstName, lastName, email, password } = ctx.request.body;
  const hashedPassword = await hashPassword(password);
  try {
    await insertOneAccount({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    ctx.body = {
      status: "ok",
      account: {
        firstName,
        lastName,
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
    const account = await retrieveAccountById(accountId);
    const serializedAccount = serializeAccountForClient(account);

    ctx.body = {
      account: serializedAccount,
    };
    ctx.status = 200;
  } catch (error) {
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

    const account = await retrieveAccountBySessionId(sessionId);

    if (!account) {
      ctx.body = { error: "Server error", error_description: "no_user_found" };
      ctx.status = 500;
      return;
    }

    const serializedAccount = serializeAccountForClient(account);

    ctx.body = {
      user: serializedAccount, // Client expects keyname user
    };
    ctx.status = 200;
    ctx.message = "User authenticated";
  } catch (error) {
    console.log("Error when fetching current account");
    ctx.status = 500;
    ctx.message = "Error when fetching current account";
  }
};
