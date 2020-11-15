import { Context } from "koa";
import {
  invalidateSessionById,
  retrieveSessionsByUser,
  retrieveSessionById,
} from "../db/sessions";
import { createAccountSession, extractSessionId } from "../utils/auth";
import { config } from "../config";
import { logger, sanitizeError } from "../logger";

export const login = async (ctx: Context) => {
  const { account } = ctx.state;

  try {
    const sessionId = await createAccountSession(account.accountId);

    ctx.status = 200;
    ctx.message = "Successfully logged in";
    ctx.cookies.set(config.cookies.session, sessionId, {
      httpOnly: false,
    });
    ctx.body = {
      account: {
        firstName: account.firstName,
        lastName: account.lastName,
      },
    };
  } catch (error) {
    const errorMessage = "Failed login";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const revokeAccountSessionById = async (ctx: Context) => {
  try {
    const sessionId = extractSessionId(ctx);

    const doesSessionExist = await retrieveSessionById(sessionId);

    if (!doesSessionExist) {
      ctx.status = 404;
      ctx.message = "Session does not exist";
      return;
    }

    await invalidateSessionById(sessionId);

    ctx.status = 204;
    ctx.message = "Successfully invalidated account sessions";
    ctx.cookies.set(config.cookies.session, "");
  } catch (error) {
    const errorMessage = "Failed to invalidate session";

    logger.error(errorMessage, {
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getAccountSessions = async (ctx: Context) => {
  const { accountId } = ctx.state;

  try {
    const accountSessions = await retrieveSessionsByUser(accountId);

    ctx.status = 200;
    ctx.message = "Successfully listed account sessions";
    ctx.body = { sessions: accountSessions };
  } catch (error) {
    const errorMessage = "Failed to list sessions";

    logger.error(errorMessage, {
      accountId: accountId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
