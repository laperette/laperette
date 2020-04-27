import * as jwt from "jsonwebtoken";
import { config } from "../../config";
import { addDays } from "date-fns";
import { knex } from "../db/db";
import { saveOneToken } from "../db/tokens";
import { Context } from "koa";

export const createToken = (
  email: string,
  accountId: string,
  createdAt: Date,
) => {
  const jwtOptions = {
    expiresIn: config.token.expiresIn,
  };

  const jwtPayload = {
    email,
    accountId,
    createdAt,
  };

  return new Promise<string>((resolve, reject) =>
    jwt.sign(
      jwtPayload,
      config.token.token_secret,
      jwtOptions,
      (err, token) => {
        if (err) {
          console.log("Unexpected error when attempting to sign JWT", err);
          return reject(err);
        }
        return resolve(token);
      },
    ),
  );
};

export const saveToken = async (token, accountId) => {
  const expiresAt: Date = addDays(new Date(), 2);

  await saveOneToken(accountId, token, expiresAt);
};

export const extractToken = (ctx: Context): string | null => {
  const { headers } = ctx;
  if (headers && headers.authorization) {
    return headers.authorization.replace("Bearer ", "");
  }
  return null;
};
