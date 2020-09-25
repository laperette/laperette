import { Context } from "koa";
import { insertOneAccount, retrieveAccountById } from "../db/accounts";
import { hashPassword } from "../utils/auth";
import { serializeAccountForClient } from "../utils/account";
import { logger, sanitizeError } from "../logger";

export const createAccount = async (ctx: Context) => {
  const { firstName, lastName, email, password } = ctx.request.body;
  const hashedPassword = await hashPassword(password);

  try {
    const [accountId] = await insertOneAccount({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const successMessage = "New account created";
    logger.info(successMessage, {
      accountId: accountId,
    });

    ctx.status = 201;
    ctx.message = successMessage;
    ctx.body = {
      account: {
        firstName,
        lastName,
      },
    };
  } catch (error) {
    const errorMessage = "Error when creating account";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getCurrentAccount = async (ctx: Context) => {
  try {
    const { accountId } = ctx.state;

    const account = await retrieveAccountById(accountId);

    if (!account) {
      const errorMessage = "Account not found";
      logger.error(errorMessage);
      ctx.status = 500;
      ctx.message = errorMessage;
      return;
    }

    const serializedAccount = serializeAccountForClient(account);

    ctx.status = 200;
    ctx.message = "User authenticated";
    ctx.body = {
      user: serializedAccount,
    };
  } catch (error) {
    const errorMessage = "Error when fetching current account";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
