import { Context } from "koa";
import {
  retrieveHousesByAccountId,
  insertOneHouse,
  insertNewHouseMembership,
  retrieveHouseById,
  checkExistingMembership,
  validateAdminStatus,, retrieveAdminHousesByAccountId
} from "../db/houses";
import { logger, sanitizeError } from "../logger";
import {
  serializeHouseForClient,
  validateNewHouseData,
  serializeHouseForDBInsert,
} from "../utils/houses";
import { retrieveAccountByEmail } from "../db/accounts";

export const createHouse = async (ctx: Context) => {
  const { accountId } = ctx.state;
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

    const successMessage = "New house created";
    logger.info(successMessage, {
      accountId: accountId,
      houseId: houseId,
    });
    ctx.status = 201;
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
  const { accountId } = ctx.state;

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

export const getAccountHouse = async (ctx: Context) => {
  const { accountId } = ctx.state;
  const { houseId } = ctx.params;

  try {
    const house = await retrieveHouseById(houseId);

    if (!house) {
      const errorMessage = "Unknown house";

      logger.error(errorMessage, {
        houseId: houseId,
        accountId: accountId,
      });

      ctx.status = 400;
      ctx.message = errorMessage;
    }

    const serializedHouse = serializeHouseForClient(house);

    ctx.status = 200;
    ctx.body = { house: serializedHouse };
  } catch (error) {
    const errorMessage = "Error while retrieving a house";

    logger.error(errorMessage, {
      accountId: accountId,
      houseId: houseId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const getAdminHouses = async (ctx: Context) => {
  const { accountId } = ctx.state;

  try {
    const houses = await retrieveAdminHousesByAccountId(accountId);

    const serializedHouses = houses.map(serializeHouseForClient);

    ctx.status = 200;
    ctx.body = { houses: serializedHouses };
  } catch (error) {
    const errorMessage =
      "Error while retrieving all houses administered by the account";

    logger.error(errorMessage, {
      accountId: accountId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};

export const addNewHouseMember = async (ctx: Context) => {
  const { accountId } = ctx.state;
  const { newMemberEmail } = ctx.request.body;
  const { houseId } = ctx.params;

  try {
    const account = await retrieveAccountByEmail(newMemberEmail);

    if (!account) {
      const errorMessage = "Unknown account";

      logger.error(errorMessage, {
        accountId: accountId,
      });

      ctx.status = 400;
      ctx.message = errorMessage;
      return;
    }

    const house = await retrieveHouseById(houseId);

    if (!house) {
      const errorMessage = "Unknown house";

      logger.error(errorMessage, {
        houseId: houseId,
      });

      ctx.status = 404;
      ctx.message = errorMessage;
      return;
    }

    const [{ is_admin: isLoggedAccountAdmin }] = await validateAdminStatus(
      accountId,
      houseId,
    );

    if (!isLoggedAccountAdmin) {
      const errorMessage =
        "Forbidden - You need to be an administrator of this house for this operation";

      logger.info(errorMessage, {
        accountId: accountId,
        newMemberId: account.account_id,
        houseId: houseId,
      });

      ctx.message = errorMessage;
      ctx.status = 403;
      return;
    }

    const isNewMemberAlreadyMember = !!(await checkExistingMembership(
      account.account_id,
      houseId,
    ));

    if (isNewMemberAlreadyMember) {
      const errorMessage = "Account already a member";

      logger.info(errorMessage, {
        newMemberId: account.account_id,
        houseId: houseId,
      });

      ctx.message = errorMessage;
      ctx.status = 409;
      return;
    }

    await insertNewHouseMembership(account.account_id, houseId, false);

    const successMessage = "New house membership created";

    logger.info(successMessage, {
      newMemberId: account.account_id,
      houseId: houseId,
    });

    ctx.message = successMessage;
    ctx.status = 201;
  } catch (error) {
    const errorMessage = "Error while adding a new member to the house";

    logger.error(errorMessage, {
      houseId: houseId,
      error: sanitizeError(error),
    });

    ctx.status = 500;
    ctx.message = errorMessage;
  }
};
