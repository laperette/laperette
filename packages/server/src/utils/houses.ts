import {
  HouseFromDB,
  HouseForClient,
  NewHouseProperties,
  HouseForDBInsert,
} from "../types/houses";
import { logger } from "../logger";
import { validateAccountId } from "./account";
import { isUuid } from "./regexp";

export const serializeHouseForClient = (
  house: HouseFromDB,
): HouseForClient => ({
  houseId: house.house_id,
  name: house.name,
});

export const serializeHouseForDBInsert = (
  newHouseProperties: NewHouseProperties,
): HouseForDBInsert => ({
  account_id: newHouseProperties.accountId,
  house_id: newHouseProperties.houseId,
  name: newHouseProperties.name,
});

export const validateNewHouseData = async (
  newHouseProperties: NewHouseProperties,
): Promise<boolean> => {
  const { accountId, name, houseId } = newHouseProperties;

  const isAccounValid = !!(await validateAccountId(accountId));

  if (!isAccounValid) {
    logger.error("Invalid account id", {
      accountId: accountId,
    });
    return false;
  }

  const isHouseIdValid = !!(await validateHouseId(houseId));

  if (!isHouseIdValid) {
    logger.error("Invalid house id", {
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

const validateHouseId = (houseId: NewHouseProperties["houseId"]): boolean => {
  /**
   * Reflection needed over houseId uniqueness validation since houseId uuid is client generated.
   * Possibility to query DB to check uuid not in DB yet but would impact perfomance
   */

  if (isUuid(houseId)) {
    return true;
  }

  return false;
};
