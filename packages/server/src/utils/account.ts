import { getAccountById } from "../db/accounts";

export const validateAccountId = async (
  accountId: string,
): Promise<boolean> => {
  if (typeof accountId !== "string") {
    return false;
  }

  const account = await getAccountById(accountId);

  if (!account) {
    return false;
  }

  return true;
};
