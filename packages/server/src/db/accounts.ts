import { knex } from "./db";

interface Account {
  firstName: string;
  lastName: string;
  email: string;
}

export const createOneAccount = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  await knex("accounts").insert({ firstName, lastName, email });
};

export const getOneAccount = async (accountId: string) => {
  const account = await knex("accounts").where({ id: accountId });
  return account[0];
};
