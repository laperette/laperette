import * as Knex from "knex";
import { addDays } from "date-fns";
import { hashPassword } from "../src/utils/auth";
import { logger } from "../src/logger";
export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw Error("Cannot seed data in production, aborting");
  }

  const seedDatabase = async () => {
    const createMockAccount = async (
      firstName: string,
      lastName: string,
      email: string,
    ): Promise<string> => {
      const dumbPassword = await hashPassword("password");
      const account = {
        first_name: firstName,
        last_name: lastName,
        email,
        password: dumbPassword,
      };

      return knex.table("accounts").insert(account).returning("account_id");
    };

    const createMockHouse = async (
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

    const addMockAccountToMockHouse = async (
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

    const createMockBooking = async (
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
    );
    logger.info(`Inserted admin account, accountId: ${adminId}`);
    logger.info("Inserting member account");
    const [memberId] = await createMockAccount(
      "Bernard",
      "Moitessier",
      "member@gmail.com",
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
