import { Context } from "koa";
import { retrieveHousesByAccountId, insertOneHouse } from "../db/houses";
import { logger, sanitizeError } from "../logger";
import {
  serializeHouseForClient,
  validateNewHouseData,
  serializeHouseForDBInsert,
} from "../utils/houses";

export const createHouse = async (ctx: Context) => {
  const { accountId } = ctx.params;

  const { name } = ctx.request.body;

  const newHouseData = { accountId, name };

  try {
    const isValidData = !!(await validateNewHouseData(newHouseData));

    if (!isValidData) {
      const errorMessage = "Impossible to create a house - Invalid data";
      logger.error(errorMessage, {
        accountId: accountId,
      });
      ctx.status = 400;
      ctx.message = errorMessage;
      return;
    }

    const serializedHouse = serializeHouseForDBInsert(newHouseData);

    const houseId = await insertOneHouse(serializedHouse);

    console.log(houseId);

    ctx.status = 200;
    ctx.body = { houseId: houseId };
  } catch (error) {
    const errorMessage = "Error while creating a house for the account";

    logger.error(errorMessage, {
      accountId: accountId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getAccountHouses = async (ctx: Context) => {
  const { accountId } = ctx.params;

  try {
    const houses = await retrieveHousesByAccountId(accountId);

    const serializedHouses = houses.map(serializeHouseForClient);

    ctx.status = 200;
    ctx.body = { houses: serializedHouses };
  } catch (error) {
    const errorMessage =
      "Error while retrieving all houses linked to the account";

    logger.error(errorMessage, {
      accountId: accountId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
