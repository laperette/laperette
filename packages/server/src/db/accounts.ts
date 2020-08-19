import { knex } from "./db";

export const insertOneAccount = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<string[]> => {
  return await knex("accounts")
    .returning(["account_id", "first_name", "last_name"])
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
};

export const retrieveAccountById = async (accountId: string) => {
  const account = await knex("accounts")
    .where({ account_id: accountId })
    .first();
  return account;
};

export const retrieveAccountByEmail = async (accountEmail: string) => {
  const account = await knex("accounts").where({ email: accountEmail }).first();
  return account;
};
