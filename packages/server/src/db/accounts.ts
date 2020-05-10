import { knex } from "./db";

export const createOneAccount = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  await knex("accounts").insert({
    first_name: firstName,
    last_name: lastName,
    email,
  });
};

export const getAccountById = async (accountId: string) => {
  const account = await knex("accounts").where({ account_id: accountId });
  return account[0];
};

export const getAccountByEmail = async (accountEmail: string) => {
  const account = await knex("accounts").where({ email: accountEmail });
  return account[0];
};
