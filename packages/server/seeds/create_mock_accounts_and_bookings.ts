import * as Knex from "knex";
import { logger } from "../src/logger";
import {
  addMockAccountToMockHouse,
  createMockAccount,
  createMockBooking,
  createMockHouse,
} from "../src/utils/tests";
export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw Error("Cannot seed data in production, aborting");
  }

  const seedDatabase = async () => {
    const clearTables = async () => {
      Promise.all([
        knex("accounts").del(),
        knex("bookings").del(),
        knex("houses").del(),
        knex("house_memberships").del(),
      ]);
    };

    logger.info("Clearing tables");
    await clearTables();
    logger.info("Cleared tables");

    logger.info("Inserting admin account");
    const [adminId] = await createMockAccount(
      "Eric",
      "Tabraly",
      "admin@gmail.com",
      "password",
    );
    logger.info(`Inserted admin account, accountId: ${adminId}`);
    logger.info("Inserting member account");
    const [memberId] = await createMockAccount(
      "Bernard",
      "Moitessier",
      "member@gmail.com",
      "password",
    );
    logger.info(`Inserted member account, accountId: ${memberId}`);

    logger.info("Inserting house");
    const houseId1 = await createMockHouse("Le Marjolet", adminId);
    logger.info("Inserted house");

    logger.info("Inserting house");
    const houseId2 = await createMockHouse("La Perette", adminId);
    logger.info("Inserted house");

    logger.info("Adding member account to first house");
    await addMockAccountToMockHouse(memberId, houseId1, false);
    logger.info("Added member account to first house");

    logger.info("Inserting approved booking");
    const approvedBookingId = await createMockBooking(
      adminId,
      3,
      4,
      "approved",
      houseId1,
    );
    logger.info(`Inserted approved booking, bookingId: ${approvedBookingId}`);
    logger.info("Inserting pending booking");
    const pendingBookingIdHouse1 = await createMockBooking(
      memberId,
      0,
      2,
      "pending",
      houseId1,
    );
    logger.info(
      `Inserted pending booking, bookingId: ${pendingBookingIdHouse1}`,
    );
    logger.info("Inserting rejected booking");
    const rejectedBookingIdHouse1 = await createMockBooking(
      memberId,
      -10,
      7,
      "rejected",
      houseId1,
    );
    logger.info(`Inserted rejected booking: ${rejectedBookingIdHouse1}`);

    logger.info("Inserting approved booking");
    const approvedBookingIdHouse2 = await createMockBooking(
      adminId,
      3,
      4,
      "approved",
      houseId2,
    );
    logger.info(
      `Inserted approved booking, bookingId: ${approvedBookingIdHouse2}`,
    );
  };

  try {
    await seedDatabase();
  } catch (error) {
    logger.error(error);
  }
}
