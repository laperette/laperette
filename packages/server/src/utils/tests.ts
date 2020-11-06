import { addDays } from "date-fns";
import { knex } from "../db/db";
import { logger } from "../logger";
import { hashPassword } from "./auth";

export const createMockAccount = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<string[]> => {
  const dumbPassword = await hashPassword(password);
  const account = {
    first_name: firstName,
    last_name: lastName,
    email,
    password: dumbPassword,
  };

  return knex("accounts").insert(account).returning("account_id");
};

export const createMockHouse = async (
  houseName: string,
  houseId: string,
  accountId: string,
): Promise<void> => {
  const trx = await knex.transaction();
  try {
    await trx("houses")
      .insert({ house_id: houseId, name: houseName })
      .returning("house_id");
    await trx("house_memberships").insert({
      account_id: accountId,
      house_id: houseId,
      is_admin: true,
    });
    trx.commit();
  } catch (error) {
    logger.error(error);
    trx.rollback();
  }
};

export const createMockBooking = async (
  accountId: string,
  daysNumberFromToday: number,
  stayLength: number,
  status: string,
  houseId: string,
): Promise<string[]> => {
  const today = new Date();

  const fakeBooking = {
    booker_id: accountId,
    arrival_time: addDays(today, daysNumberFromToday),
    departure_time: addDays(today, daysNumberFromToday + stayLength),
    comments: "Eager to be there!",
    companions: 2,
    status,
    house_id: houseId,
  };

  return knex("bookings").insert(fakeBooking).returning("booking_id");
};

export const createMockSession = async (
  accountId: string,
  validityLength: number,
): Promise<string[]> => {
  const expiryDate = addDays(new Date(), validityLength);
  return knex("sessions")
    .insert({
      account_id: accountId,
      expires_at: expiryDate,
    })
    .returning("session_id");
};

export const addMockAccountToMockHouse = async (
  accountId: string,
  houseId: string,
  isAdmin: boolean,
): Promise<string> => {
  try {
    await knex("house_memberships").insert({
      account_id: accountId,
      house_id: houseId,
      is_admin: isAdmin,
    });
  } catch (error) {
    logger.error(error);
  }
  return houseId;
};
