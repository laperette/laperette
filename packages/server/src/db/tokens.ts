import { knex } from "./db";

export const saveOneToken = async (
  account_id: string,
  token: string,
  expires_at: Date,
) => {
  await knex("tokens").insert({ account_id, token, expires_at });
};
