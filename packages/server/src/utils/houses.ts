import {
  HouseFromDB,
  HouseForClient,
  NewHouseProperties,
} from "../types/houses";
import { logger } from "../logger";
import { validateAccountId } from "./account";

export const serializeHouseForClient = (
  house: HouseFromDB,
): HouseForClient => ({
  houseId: house.house_id,
  name: house.name,
});

export const serializeHouseForDBInsert = (
  newHouseProperties: NewHouseProperties,
) => ({
  account_id: newHouseProperties.accountId,
  name: newHouseProperties.name,
});

export const validateNewHouseData = async (
  newHouseProperties: NewHouseProperties,
): Promise<boolean> => {
  const { accountId, name } = newHouseProperties;

  const isAccounValid = !!(await validateAccountId(accountId));

  if (!isAccounValid) {
    logger.error("Invalid account id", {
      accountId: accountId,
    });
    return false;
  }

  const isNameValid = validateName(name);

  if (!isNameValid) {
    logger.error("Invalid name", {
      accountId: accountId,
      name: name,
    });
    return false;
  }

  return true;
};

const validateName = (name: NewHouseProperties["name"]): boolean => {
  if (typeof name !== "string") {
    return false;
  }

  if (name.length === 0 || name.trim().length === 0) {
    return false;
  }

  return true;
};
