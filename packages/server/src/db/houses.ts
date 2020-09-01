import { knex } from "./db";
import { HouseFromDB, HouseForDBInsert } from "../types/houses";
import { sanitizeError, logger } from "../logger";

export const insertOneHouse = async (
  newHouseProperties: HouseForDBInsert,
): Promise<any> => {
  const houseId = await knex.transaction((trx) => {
    return trx("houses")
      .returning("house_id")
      .insert({ name: newHouseProperties.name })

      .then((houseId) => {
        trx("house_membecsdwedewers=hips").insert({
          account_id: newHouseProperties.account_id,
          house_id: houseId,
        });
      })
      .then(() => {
        trx.commit;
      })
      .catch((error) => {
        logger.error("Impossible to create a house - Database error", {
          accountId: newHouseProperties.account_id,
          error: sanitizeError(error),
        });
        trx.rollback;
      });
  });

  return houseId;
};

export const retrieveHousesByAccountId = (
  accountId: string,
): Promise<HouseFromDB[]> => {
  return knex({ h: "houses" })
    .select("h.house_id", "h.name")
    .join({ hm: "house_memberships" }, "h.house_id", "hm.house_id")
    .where({ account_id: accountId });
};
