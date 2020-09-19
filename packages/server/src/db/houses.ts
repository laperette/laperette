import { knex } from "./db";
import { HouseFromDB, HouseForDBInsert } from "../types/houses";

export const insertOneHouse = async (
  newHouseProperties: HouseForDBInsert,
): Promise<string> => {
  let houseId;
  const trx = await knex.transaction();
  try {
    [houseId] = await trx("houses")
      .returning("house_id")
      .insert({ name: newHouseProperties.name });

    await trx("house_memberships").insert({
      account_id: newHouseProperties.account_id,
      house_id: houseId,
      is_admin: true,
    });

    trx.commit();
  } catch (error) {
    trx.rollback();
    throw error;
  }
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

export const retrieveHouseById = async (houseId: string) => {
  return knex("houses")
    .select("houses.house_id", "houses.name")
    .where({ house_id: houseId })
    .first();
};

export const validateMembership = (accountId: string, houseId: string) => {
  return knex("house_memberships")
    .where({
      account_id: accountId,
      house_id: houseId,
    })
    .first();
};

export const validateAdminStatus = (accountId: string, houseId: string) => {
  return knex("house_memberships").select("is_admin").where({
    account_id: accountId,
    house_id: houseId,
  });
};

export const insertNewHouseMembership = (
  accountId: string,
  houseId: string,
) => {
  return knex("house_memberships").insert({
    account_id: accountId,
    house_id: houseId,
  });
};
