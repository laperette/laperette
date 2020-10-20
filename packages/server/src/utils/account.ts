import { retrieveAccountById } from "../db/accounts";
import { AccountFromDB, AccountForClient } from "../types/accounts";

export const validateAccountId = async (
  accountId: string,
): Promise<boolean> => {
  if (typeof accountId !== "string") {
    return false;
  }

  const account = await retrieveAccountById(accountId);

  if (!account) {
    return false;
  }

  return true;
};

export const serializeAccountForClient = (
  account: AccountFromDB,
): AccountForClient => ({
  accountId: account.account_id,
  firstName: account.first_name,
  lastName: account.last_name,
  email: account.email,
});
