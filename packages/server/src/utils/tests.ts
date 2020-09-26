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

  return await knex.table("accounts").insert(account).returning("account_id");
};

export const createMockHouse = async (
  name: string,
  accountId: string,
): Promise<string> => {
  const fakeHouse = {
    name,
  };

  let houseId;

  const trx = await knex.transaction();
  try {
    [houseId] = await trx("houses")
      .returning("house_id")
      .insert({ name: fakeHouse.name });

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
  return houseId;
};

export const createMockBooking = async (
  accountId: string,
  randomDate: number,
  stayLength: number,
  status: string,
  houseId: string,
): Promise<void> => {
  const today = new Date();
  const fakeBooking = {
    booker_id: accountId,
    arrival_time: addDays(today, randomDate),
    departure_time: addDays(today, randomDate + stayLength),
    comments: "Eager to be there!",
    companions: ["Alain Gerbault", "Olivier de Kersauson"],
    status,
    house_id: houseId,
  };

  return knex("bookings").insert(fakeBooking).returning("booking_id");
};

export const createMockSession = async (
  accountId: string,
  validityLength: number,
) => {
  const expiryDate = addDays(new Date(), validityLength);
  return knex("sessions")
    .insert({
      account_id: accountId,
      expires_at: expiryDate,
    })
    .returning("session_id");
};
