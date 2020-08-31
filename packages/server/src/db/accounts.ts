import { knex } from "./db";
import { NewAccountProperties, AccountFromDB } from "../types/accounts";

export const insertOneAccount = async ({
  firstName,
  lastName,
  email,
  password,
}: NewAccountProperties): Promise<string> => {
  return await knex("accounts").returning(["account_id"]).insert({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  });
};

export const retrieveAccountById = async (
  accountId: string,
): Promise<AccountFromDB> => {
  const account = await knex("accounts")
    .where({ account_id: accountId })
    .first();
  return account;
};

export const retrieveAccountByEmail = async (
  accountEmail: string,
): Promise<AccountFromDB> => {
  const account = await knex("accounts").where({ email: accountEmail }).first();
  return account;
};
