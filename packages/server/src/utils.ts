import * as jwt from "jsonwebtoken";
import { config } from "../config";

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
